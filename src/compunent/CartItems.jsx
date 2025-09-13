import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  fetchCart,
  addToCart,
  removeFromCart,
} from "../features/cart/cartSlice";
import { v4 as uuidv4 } from "uuid";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const colorNames = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Black",
  "White",
  "Silver",
];

const CartItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cart, loading, error } = useSelector((state) => state.cart);

  const [guestId] = useState(
    localStorage.getItem("guestId") || `guest_${uuidv4()}`
  );

  useEffect(() => {
    localStorage.setItem("guestId", guestId);
    dispatch(fetchCart({ guestId }));
  }, [dispatch, guestId]);

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
      .then(() => toast.success("Quantity updated!", { position: "top-right" }))
      .catch((err) =>
        toast.error(err || "Failed to update quantity", {
          position: "top-right",
        })
      );
  };

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
      .then(() => toast.success("Item removed!", { position: "top-right" }))
      .catch((err) =>
        toast.error(err || "Failed to remove item", { position: "top-right" })
      );
  };

  const totalItems = () =>
    Array.isArray(cart)
      ? cart.reduce((t, item) => t + (item.quantity || 1), 0)
      : 0;

  const totalPrice = () =>
    Array.isArray(cart)
      ? cart.reduce(
          (t, item) =>
            t +
            (item.quantity || 1) *
              (item.product_id?.product_discounted_price || 0),
          0
        )
      : 0;

  if (loading) {
    return (
      <div className="md:w-[65%] mx-auto p-6 bg-light min-h-screen">
        <h2 className="text-3xl font-bold mb-4 text-dark">Loading Cart...</h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 mb-4">
            <Skeleton width={80} height={80} />
            <div className="flex-1">
              <Skeleton width="60%" height={20} />
              <Skeleton width="40%" height={20} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-light min-h-screen">
        <h3 className="font-bold text-2xl mb-2 text-dark">
          Error Loading Cart
        </h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="text-center p-6 bg-light min-h-screen">
        <h3 className="font-bold text-2xl mb-2 text-dark">
          Your Cart is Empty
        </h3>
        <p className="text-dark/70">Explore our products to fill your cart!</p>
      </div>
    );
  }

  return (
    <div className="md:w-[70%] mx-auto md:p-4 bg-light ">
      <h2 className="text-3xl font-bold mb-6 text-dark">
        🛒 Your Cart{" "}
        <span className="text-xl font-medium text-primary">
          ({totalItems()} items)
        </span>
      </h2>

      <div className="bg-white p-5 rounded-xl shadow space-y-4">
        {cart.map((item, index) => {
          const isVapeOrPod =
            item.product_id?.category?.name?.includes("Disposables") ||
            item.product_id?.category?.name?.includes("Devices");
          const colorIndex =
            item.product_id?.product_images?.indexOf(item.selected_image) || -1;

          return (
            <div
              key={`${item.product_id?._id || index}-${item.selected_image}`}
              className="flex items-center justify-between border-b last:border-0 pb-4 mb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.selected_image || "https://via.placeholder.com/150"}
                  alt={item.product_id?.product_name || "Product"}
                  className="w-20 h-20 rounded-lg object-cover border"
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

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleRemoveItem(item)}
                  className="bg-red-100 text-red-600 rounded-full p-2 hover:bg-red-200 transition"
                >
                  <FaTrash size={12} />
                </button>
                <span className="font-medium text-dark">{item.quantity}</span>
                <button
                  onClick={() => handleAddItem(item)}
                  className="bg-green-100 text-green-600 rounded-full p-2 hover:bg-green-200 transition"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      <div className="mt-6 p-5  bg-white rounded-xl shadow flex flex-col md:hidden justify-between items-center gap-4">
        <h3 className="text-lg font-bold text-dark">
          Total: <span className="text-primary">Rs. {totalPrice()}</span>
        </h3>
        <button
          onClick={() => navigate("/paymentMethod")}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
        >
          Proceed to Payment <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default CartItems;
