import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  fetchCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../features/cart/cartSlice";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const colorNames = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Black",
  "White",
  "Silver",
];

const Cartss = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [loadingItems, setLoadingItems] = useState({});
  const [shippingAddress, setShippingAddress] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (user && user.token) {
      dispatch(fetchCart())
        .unwrap()
        .catch((err) => {
          toast.error(err || "Failed to fetch cart");
        });
      setEmail(user.email || "");
    } else {
      toast.warn("Please log in to view your cart");
      navigate("/login");
    }
  }, [dispatch, user, navigate]);

  const totalItems = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotal = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce(
      (sum, item) =>
        sum + (item.product_id?.product_discounted_price || 0) * item.quantity,
      0
    );
  };

  const handleAddItem = async (
    productId,
    selectedImage,
    nicotineStrength,
    flavor
  ) => {
    if (!productId || !selectedImage || !nicotineStrength || !flavor) {
      console.log("handleAddItem - Missing required fields:", {
        productId,
        selectedImage,
        nicotineStrength,
        flavor,
      });
      toast.error(
        "Please select all required fields (product, image, nicotine strength, flavor)"
      );
      return;
    }

    setLoadingItems((prev) => ({ ...prev, [productId]: true }));
    try {
      const response = await axios.get(
        `https://api.cloudandroots.com/api/products/product/${productId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const product = response.data;
      if (!product.flavors.includes(flavor)) {
        console.log("handleAddItem - Invalid flavor:", flavor, product.flavors);
        toast.error(`Flavor '${flavor}' is not available for this product`);
        return;
      }
      const cartItem = cart.find(
        (item) =>
          item.product_id._id === productId &&
          item.selected_image === selectedImage &&
          item.nicotine_strength === nicotineStrength &&
          item.flavor === flavor
      );
      const currentQuantity = cartItem ? cartItem.quantity : 0;

      if (product.product_stock <= currentQuantity) {
        toast.error(
          `Cannot add more ${product.product_name}. Only ${product.product_stock} in stock.`
        );
        return;
      }

      await dispatch(
        addToCart({
          prod_id: productId,
          selected_image: selectedImage,
          nicotine_strength: nicotineStrength,
          flavor,
        })
      ).unwrap();
      dispatch(fetchCart());
      toast.success("Item added to cart!");
    } catch (err) {
      console.error("Add item error:", err);
      toast.error(err || "Failed to add item to cart.");
    } finally {
      setLoadingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveItem = (
    productId,
    selectedImage,
    nicotineStrength,
    flavor
  ) => {
    setLoadingItems((prev) => ({ ...prev, [productId]: true }));
    dispatch(
      removeFromCart({
        prod_id: productId,
        selected_image: selectedImage,
        nicotine_strength: nicotineStrength,
        flavor,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchCart());
        toast.success("Item removed from cart!");
      })
      .catch((err) => {
        toast.error(err || "Failed to remove item from cart.");
      })
      .finally(() => {
        setLoadingItems((prev) => ({ ...prev, [productId]: false }));
      });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const re = /^\+?\d{10,15}$/;
    return re.test(phone);
  };

  const handlePayment = async () => {
    if (!shippingAddress) {
      toast.error("Please provide a shipping address.");
      return;
    }
    if (!email) {
      toast.error("Please provide an email address.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please provide a valid email address.");
      return;
    }
    if (!phoneNumber) {
      toast.error("Please provide a phone number.");
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Please provide a valid phone number (10-15 digits).");
      return;
    }
    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    try {
      const response = await axios.post(
        "https://api.cloudandroots.com/api/payment/checkout",
        {
          products: cart.map((item) => ({
            product_id: item.product_id._id,
            quantity: item.quantity,
            selected_image: item.selected_image,
            nicotine_strength: item.nicotine_strength,
            flavor: item.flavor,
          })),
          shipping_address: shippingAddress,
          order_email: email,
          phone_number: phoneNumber,
          user_id: user?._id,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      if (!response.data.url) {
        throw new Error("No Stripe URL returned from checkout");
      }
      await dispatch(clearCart()).unwrap();
      toast.success("Payment initiated and cart cleared!");
      window.location.assign(response.data.url);
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message ||
          "Failed to initiate payment. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4 bg-gray-100 min-h-screen">
        <PulseLoader size={15} color="blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-gray-100 min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-100 min-h-screen">
        <h3 className="font-bold text-2xl mb-2 text-gray-800">
          Your Cart is Empty
        </h3>
        <p className="text-gray-600">Explore our products to fill your cart!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      <div className="w-[85%] mx-auto pt-8 flex flex-col lg:flex-row justify-between gap-6 p-4 min-h-screen">
        <div className="w-full lg:w-2/3">
          <h2 className="text-3xl font-bold mb-4">
            ← Cart{" "}
            <span className="text-xl font-medium">({totalItems()} items)</span>
          </h2>
          <div className="bg-white p-4 rounded-xl space-y-4">
            {cart.map((item) => {
              const isVapeOrPod =
                item.product_id?.category?.name?.includes("Disposables") ||
                item.product_id?.category?.name?.includes("Devices");
              const colorIndex = item.product_id?.product_images.indexOf(
                item.selected_image
              );
              return (
                <div
                  key={`${item.product_id?._id}-${item.selected_image}-${item.nicotine_strength}-${item.flavor}`}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.selected_image || "https://via.placeholder.com/80"
                      }
                      alt={`${item.product_id?.product_name || "Product"} ${
                        isVapeOrPod ? colorNames[colorIndex] || "" : ""
                      }`}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">
                        {item.product_id?.product_name || "Unknown Product"}
                        {isVapeOrPod && colorIndex !== -1 && (
                          <span className="text-sm text-gray-600 ml-2">
                            ({colorNames[colorIndex] || "Selected Color"})
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Nicotine: {item.nicotine_strength || "None"} mg
                      </p>
                      <p className="text-sm text-gray-600">
                        Flavor: {item.flavor || "None"}
                      </p>
                      <p className="text-red-500 font-bold mt-1">
                        Rs. {item.product_id?.product_discounted_price || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={loadingItems[item.product_id?._id]}
                      onClick={() =>
                        handleRemoveItem(
                          item.product_id?._id,
                          item.selected_image,
                          item.nicotine_strength,
                          item.flavor
                        )
                      }
                      className="bg-red-100 text-red-600 rounded-full p-2"
                    >
                      <FaTrash size={12} />
                    </button>
                    <span className="font-medium">
                      {loadingItems[item.product_id?._id] ? (
                        <PulseLoader size={6} color="blue" />
                      ) : (
                        item.quantity
                      )}
                    </span>
                    <button
                      disabled={loadingItems[item.product_id?._id]}
                      onClick={() =>
                        handleAddItem(
                          item.product_id?._id,
                          item.selected_image,
                          item.nicotine_strength,
                          item.flavor
                        )
                      }
                      className="bg-red-100 text-red-600 rounded-full p-2"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4">Total</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-2"
                placeholder="Enter email address"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border rounded-lg p-2"
                placeholder="Enter phone number"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Shipping Address
              </label>
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full border rounded-lg p-2"
                placeholder="Enter shipping address"
              />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Estimated Delivery Time: <strong>45 Mins</strong>
            </p>
            {cart.map((item) => (
              <div
                key={`${item.product_id?._id}-${item.selected_image}-${item.nicotine_strength}-${item.flavor}`}
                className="flex justify-between text-sm text-gray-800"
              >
                <span>
                  {item.quantity} x{" "}
                  {item.product_id?.product_name || "Unknown Product"} (
                  {item.nicotine_strength || "None"} mg, {item.flavor || "None"}
                  )
                </span>
                <span>
                  Rs.{" "}
                  {(item.product_id?.product_discounted_price || 0) *
                    item.quantity}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-sm text-gray-800 mt-2">
              <span>Discount</span>
              <span>- Rs. 0</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between text-xl font-bold text-gray-800">
              <span>Due Payment</span>
              <span>Rs. {calculateTotal()}</span>
            </div>
            <button
              onClick={handlePayment}
              disabled={!shippingAddress || !email || !phoneNumber}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold disabled:bg-gray-400"
            >
              CONTINUE TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cartss;
