import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import {
  fetchCart,
  addToCart,
  removeFromCart,
} from "../features/cart/cartSlice";
import { PulseLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";

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
  const { user } = useSelector((state) => state.auth);
  const [loadingQty, setLoadingQty] = useState({});

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    } else {
      navigate("/login");
    }
  }, [dispatch, user, navigate]);

  const totalItems = () =>
    Array.isArray(cart)
      ? cart.reduce((total, item) => total + item.quantity, 0)
      : 0;

  const calculateCost = () =>
    Array.isArray(cart)
      ? cart.reduce(
          (sum, item) =>
            sum +
            (item.product_id?.product_discounted_price || 0) * item.quantity,
          0
        )
      : 0;

  const handleAddItem = (productId, selectedImage) => {
    setLoadingQty((prev) => ({ ...prev, [productId]: true }));
    dispatch(addToCart({ prod_id: productId, selected_image: selectedImage }))
      .unwrap()
      .then(() => dispatch(fetchCart()))
      .catch((err) => console.error("Add error", err))
      .finally(() =>
        setLoadingQty((prev) => ({ ...prev, [productId]: false }))
      );
  };

  const handleRemoveItem = (productId, selectedImage) => {
    setLoadingQty((prev) => ({ ...prev, [productId]: true }));
    dispatch(
      removeFromCart({ prod_id: productId, selected_image: selectedImage })
    )
      .unwrap()
      .then(() => dispatch(fetchCart()))
      .catch((err) => console.error("Remove error", err))
      .finally(() =>
        setLoadingQty((prev) => ({ ...prev, [productId]: false }))
      );
  };

  if (loading && cart.length === 0) {
    return (
      <div className="text-center p-4">
        <PulseLoader size={15} color="blue" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Your Cart is Empty
        </h3>
        <p className="text-gray-600">Browse items and add them to your cart!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800">
          Cart{" "}
          <span className="text-lg font-normal text-gray-500">
            ({totalItems()} items)
          </span>
        </h3>
      </div>

      {cart.map((item) => {
        const productId = item.product_id?._id;
        const colorIndex = item.product_id?.product_images.indexOf(
          item.selected_image
        );
        const isVapeOrPod =
          item.product_id?.product_catagory.includes("Disposables") ||
          item.product_id?.product_catagory.includes("Devices");

        return (
          <div
            key={`${productId}-${item.selected_image}`}
            className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl shadow-sm"
          >
            <img
              src={item.selected_image}
              alt="Product"
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h6 className="text-md font-semibold text-gray-900">
                {item.product_id?.product_name}
              </h6>
              {isVapeOrPod && colorIndex !== -1 && (
                <p className="text-sm text-gray-500">
                  {colorNames[colorIndex]}
                </p>
              )}
              <p className="text-blue-600 font-bold">
                Rs. {item.product_id?.product_discounted_price || 0}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() =>
                    handleRemoveItem(productId, item.selected_image)
                  }
                  className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full"
                >
                  {item.quantity > 1 ? (
                    <FaMinus size={12} />
                  ) : (
                    <FaTrash size={12} />
                  )}
                </button>
                <div className="w-6 text-center font-medium text-gray-800">
                  {loadingQty[productId] ? (
                    <PulseLoader size={6} color="blue" />
                  ) : (
                    item.quantity
                  )}
                </div>
                <button
                  onClick={() => handleAddItem(productId, item.selected_image)}
                  className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-full"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="pt-4 border-t border-gray-200">
        <p className="text-lg font-semibold text-gray-800 mb-3">
          Total: Rs. {calculateCost()}
        </p>
        <Link to="/payment">
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Carts;