import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import {
  fetchCart,
  removeFromCart,
  addToCart,
} from "../features/cart/cartSlice";

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
  const { items: cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    } else {
      toast.error("Please log in to view your cart", { position: "top-right" });
    }
  }, [dispatch, user]);

  const totalItems = () =>
    Array.isArray(cart)
      ? cart.reduce((total, item) => total + (item.quantity || 1), 0)
      : 0;

  const calculateCost = () =>
    Array.isArray(cart)
      ? cart.reduce(
          (sum, item) =>
            sum +
            (item.product_id?.product_discounted_price || 0) *
              (item.quantity || 1),
          0
        )
      : 0;

  const handleAddItem = (item) => {
    dispatch(
      addToCart({
        prod_id: item.product_id._id,
        selected_image: item.selected_image,
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

  const handleRemoveItem = (item) => {
    dispatch(
      removeFromCart({
        prod_id: item.product_id._id,
        selected_image: item.selected_image,
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

  if (loading) {
    return (
      <div className="text-center py-20 font-montserrat">
        <h3 className="text-3xl font-extrabold text-dark mb-3">
          Loading Cart...
        </h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 font-montserrat">
        <h3 className="text-3xl font-extrabold text-dark mb-3">
          Error Loading Cart
        </h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="text-center py-20 font-montserrat">
        <h3 className="text-3xl font-extrabold text-dark mb-3">
          Your Cart is Empty 🛒
        </h3>
        <p className="text-dark/70">
          Looks like you haven’t added anything yet!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 font-montserrat">
      <h3 className="text-3xl font-extrabold text-dark mb-10">
        Your Cart{" "}
        <span className="text-lg font-medium text-dark/60">
          ({totalItems()} items)
        </span>
      </h3>

      <div className="space-y-6">
        {cart.map((item) => {
          const colorIndex =
            item.product_id?.product_images?.indexOf(item.selected_image) || -1;
          const isVapeOrPod =
            item.product_id?.category?.name === "Disposables" ||
            item.product_id?.category?.name === "Devices";

          return (
            <div
              key={`${item.product_id?._id}-${item.selected_image}`}
              className="flex items-center gap-6 bg-white/80 backdrop-blur-md border border-gray-100 p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-light to-white p-2">
                <img
                  src={item.selected_image}
                  alt="Product"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h6 className="text-lg font-bold text-dark">
                  {item.product_id?.product_name}
                </h6>
                {isVapeOrPod && colorIndex !== -1 && (
                  <p className="text-sm text-dark/60">
                    Color: {colorNames[colorIndex]}
                  </p>
                )}
                <p className="text-primary font-semibold mt-1">
                  Rs. {item.product_id?.product_discounted_price || 0}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-full transition"
                  >
                    {item.quantity > 1 ? (
                      <FaMinus size={12} />
                    ) : (
                      <FaTrash size={12} />
                    )}
                  </button>
                  <div className="w-8 h-8 flex items-center justify-center bg-light rounded-lg text-dark font-semibold">
                    {item.quantity}
                  </div>
                  <button
                    onClick={() => handleAddItem(item)}
                    className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-full transition"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-white shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Total Items:</span>
          <span className="font-bold">{totalItems()}</span>
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-medium">Total Price:</span>
          <span className="text-2xl font-extrabold">Rs. {calculateCost()}</span>
        </div>
        <Link to="/payment">
          <button className="w-full py-3 bg-white text-primary font-bold rounded-xl shadow-md hover:shadow-xl transition">
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Carts;
