import React, { useState } from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

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
  const [cart, setCart] = useState([
    {
      _id: "1",
      product_name: "Mango E-Liquid",
      product_discounted_price: 1999,
      product_base_price: 2500,
      product_images: [
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      ],
      selected_image:
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      product_catagory: ["E-Liquid"],
      quantity: 2,
    },
    {
      _id: "2",
      product_name: "Strawberry Ice E-Liquid",
      product_discounted_price: 2200,
      product_base_price: 2800,
      product_images: [
        "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
      ],
      selected_image:
        "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
      product_catagory: ["E-Liquid"],
      quantity: 1,
    },
  ]);

  const totalItems = () =>
    Array.isArray(cart)
      ? cart.reduce((total, item) => total + item.quantity, 0)
      : 0;

  const calculateCost = () =>
    Array.isArray(cart)
      ? cart.reduce(
          (sum, item) =>
            sum + (item.product_discounted_price || 0) * item.quantity,
          0
        )
      : 0;

  const handleAddItem = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

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
      {/* Title */}
      <h3 className="text-3xl font-extrabold text-dark mb-10">
        Your Cart{" "}
        <span className="text-lg font-medium text-dark/60">
          ({totalItems()} items)
        </span>
      </h3>

      {/* Cart Items */}
      <div className="space-y-6">
        {cart.map((item) => {
          const colorIndex = item.product_images.indexOf(item.selected_image);
          const isVapeOrPod =
            item.product_catagory.includes("Disposables") ||
            item.product_catagory.includes("Devices");

          return (
            <div
              key={`${item._id}-${item.selected_image}`}
              className="flex items-center gap-6 bg-white/80 backdrop-blur-md border border-gray-100 p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-light to-white p-2">
                <img
                  src={item.selected_image}
                  alt="Product"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h6 className="text-lg font-bold text-dark">
                  {item.product_name}
                </h6>
                {isVapeOrPod && colorIndex !== -1 && (
                  <p className="text-sm text-dark/60">
                    Color: {colorNames[colorIndex]}
                  </p>
                )}
                <p className="text-primary font-semibold mt-1">
                  Rs. {item.product_discounted_price || 0}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => handleRemoveItem(item._id)}
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
                    onClick={() => handleAddItem(item._id)}
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

      {/* Checkout Summary */}
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
