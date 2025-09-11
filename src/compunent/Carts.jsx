import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";
import { fetchCart, addToCart, removeFromCart, createOrder } from "../features/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Loader from "./Loader";

const colorNames = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Black",
  "White",
  "Silver",
];

const Carts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cart, loading, error } = useSelector((state) => state.cart);
  const [fullName, setFullName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [guestId] = useState(localStorage.getItem("guestId") || `guest_${uuidv4()}`);

  useEffect(() => {
    localStorage.setItem("guestId", guestId); // Persist guestId in localStorage
    dispatch(fetchCart({ guestId }));
  }, [dispatch, guestId]);

  // Increase quantity
  const handleAddItem = (item) => {
    if (!item.product_id) {
      toast.error("Invalid product data", { position: "top-right" });
      return;
    }
    dispatch(
      addToCart({
        prod_id: item.product_id._id,
        selected_image: item.selected_image,
        guestId,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Quantity updated!", { position: "top-right" });
      })
      .catch((err) => {
        toast.error(err || "Failed to update quantity", {
          position: "top-right",
        });
      });
  };

  // Decrease / remove item
  const handleRemoveItem = (item) => {
    if (!item.product_id) {
      toast.error("Invalid product data", { position: "top-right" });
      return;
    }
    dispatch(
      removeFromCart({
        prod_id: item.product_id._id,
        selected_image: item.selected_image,
        guestId,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Item removed!", { position: "top-right" });
      })
      .catch((err) => {
        toast.error(err || "Failed to remove item", { position: "top-right" });
      });
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!fullName || !shippingAddress || !email || !phoneNumber) {
      toast.error("Please fill in all fields", { position: "top-right" });
      return;
    }

    const orderData = {
      products: cart.map((item) => ({
        product_id: item.product_id._id,
        quantity: item.quantity,
        selected_image: item.selected_image,
      })),
      total_amount: calculateTotal(),
      shipping_address: shippingAddress,
      order_email: email,
      phone_number: phoneNumber,
      full_name: fullName,
      guestId,
    };

    dispatch(createOrder(orderData))
      .unwrap()
      .then(() => {
        toast.success("Order placed successfully!", { position: "top-right" });
        localStorage.removeItem("guestId"); // Clear guestId after order
        navigate("/");
      })
      .catch((err) => {
        toast.error(err || "Failed to place order", { position: "top-right" });
      });
  };

  // Total items & price
  const totalItems = () =>
    Array.isArray(cart)
      ? cart.reduce((t, item) => t + (item.quantity || 1), 0)
      : 0;

  const calculateTotal = () =>
    Array.isArray(cart)
      ? cart.reduce(
          (sum, item) =>
            sum +
            (item.product_id?.product_discounted_price || 0) *
              (item.quantity || 1),
          0
        )
      : 0;

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-light">
        <h3 className="font-bold text-2xl mb-2 text-dark">
          Error Loading Cart
        </h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="text-center p-4 bg-light">
        <h3 className="font-bold text-2xl mb-2 text-dark">
          Your Cart is Empty
        </h3>
        <p className="text-dark/70">Explore our products to fill your cart!</p>
      </div>
    );
  }

  return (
    <div className="bg-light font-montserrat">
      <div className="flex flex-col gap-6 p-4">
        {/* Cart Items */}
        <div className="w-full">
          <h2 className="text-3xl font-bold mb-4 text-dark">
            ← Cart{" "}
            <span className="text-xl font-medium">({totalItems()} items)</span>
          </h2>
          <div className="bg-white p-4 rounded-xl space-y-4 shadow">
            {cart.map((item, index) => {
              const isVapeOrPod =
                item.product_id?.category?.name?.includes("Disposables") ||
                item.product_id?.category?.name?.includes("Devices");
              const colorIndex =
                item.product_id?.product_images?.indexOf(item.selected_image) ||
                -1;
              return (
                <div
                  key={`${item.product_id?._id || index}-${
                    item.selected_image
                  }`}
                  className="flex items-center justify-between bg-light p-4 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.selected_image || "https://via.placeholder.com/150"
                      }
                      alt={item.product_id?.product_name || "Product"}
                      className="w-20 h-20 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="font-semibold text-lg text-dark">
                        {item.product_id?.product_name || "Unknown Product"}
                        {isVapeOrPod && colorIndex !== -1 && (
                          <span className="text-sm text-dark/60 ml-2">
                            ({colorNames[colorIndex] || "Selected Color"})
                          </span>
                        )}
                      </h4>
                      <p className="text-primary font-bold mt-1">
                        Rs. {item.product_id?.product_discounted_price || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="bg-primary/10 text-primary rounded-full p-2"
                    >
                      <FaTrash size={12} />
                    </button>
                    <span className="font-medium text-dark">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleAddItem(item)}
                      className="bg-primary/10 text-primary rounded-full p-2"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checkout Summary */}
        
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-white shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Total Items:</span>
            <span className="font-bold">{totalItems()}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-medium">Total Price:</span>
            <span className="text-2xl font-extrabold">
              Rs. {calculateTotal()}
            </span>
          </div>
          <Link to="/payment">
            <button className="w-full py-3 bg-white text-primary font-bold rounded-xl shadow-md hover:shadow-xl transition">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Carts;