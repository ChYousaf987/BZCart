import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

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
  // Dummy cart items (frontend only)
  const [cart, setCart] = useState([
    {
      _id: "1",
      product_name: "Smart Watch",
      product_discounted_price: 3500,
      product_images:
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      selected_image:
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      flavor: "Mint",
      category: { name: "Devices" },
      quantity: 1,
    },
    {
      _id: "2",
      product_name: "Running Shoes",
      product_discounted_price: 5000,
      product_images:
        "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
      selected_image:
        "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
      flavor: "N/A",
      category: { name: "Shoes" },
      quantity: 2,
    },
  ]);

  const [shippingAddress, setShippingAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Increase quantity
  const handleAddItem = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease / remove item
  const handleRemoveItem = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Total items & price
  const totalItems = () => cart.reduce((t, item) => t + item.quantity, 0);
  const calculateTotal = () =>
    cart.reduce(
      (sum, item) => sum + item.product_discounted_price * item.quantity,
      0
    );

  if (cart.length === 0) {
    return (
      <div className="text-center p-4 bg-light min-h-screen">
        <h3 className="font-bold text-2xl mb-2 text-dark">
          Your Cart is Empty
        </h3>
        <p className="text-dark/70">Explore our products to fill your cart!</p>
      </div>
    );
  }

  return (
    <div className="bg-light font-montserrat">
      <div className="w-[95%] mx-auto pt-8 flex flex-col lg:flex-row justify-between gap-6 p-4 min-h-screen">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-3xl font-bold mb-4 text-dark">
            ← Cart{" "}
            <span className="text-xl font-medium">({totalItems()} items)</span>
          </h2>
          <div className="bg-white p-4 rounded-xl space-y-4 shadow">
            {cart.map((item) => {
              const isVapeOrPod =
                item.category?.name?.includes("Disposables") ||
                item.category?.name?.includes("Devices");
              const colorIndex = item.product_images.indexOf(
                item.selected_image
              );
              return (
                <div
                  key={item._id}
                  className="flex items-center justify-between bg-light p-4 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.selected_image}
                      alt={item.product_name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-lg text-dark">
                        {item.product_name}
                        {isVapeOrPod && colorIndex !== -1 && (
                          <span className="text-sm text-dark/60 ml-2">
                            ({colorNames[colorIndex] || "Selected Color"})
                          </span>
                        )}
                      </h4>
                     
                      <p className="text-primary font-bold mt-1">
                        Rs. {item.product_discounted_price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="bg-primary/10 text-primary rounded-full p-2"
                    >
                      <FaTrash size={12} />
                    </button>
                    <span className="font-medium text-dark">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleAddItem(item._id)}
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
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4 text-dark">Total</h3>

            <div className="mb-4">
              <label className="block text-dark mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-dark/20 rounded-lg p-2"
                placeholder="Enter email address"
              />
            </div>
            <div className="mb-4">
              <label className="block text-dark mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border border-dark/20 rounded-lg p-2"
                placeholder="Enter phone number"
              />
            </div>
            <div className="mb-4">
              <label className="block text-dark mb-2">Shipping Address</label>
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full border border-dark/20 rounded-lg p-2"
                placeholder="Enter shipping address"
              />
            </div>

            <p className="text-sm text-dark/70 mb-2">
              Estimated Delivery Time: <strong>45 Mins</strong>
            </p>

            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between text-sm text-dark"
              >
                <span>
                  {item.quantity} x {item.product_name}
                </span>
                <span>Rs. {item.product_discounted_price * item.quantity}</span>
              </div>
            ))}

            <hr className="my-4" />
            <div className="flex justify-between text-xl font-bold text-dark">
              <span>Due Payment</span>
              <span>Rs. {calculateTotal()}</span>
            </div>

            <button
              onClick={() => alert("Checkout simulation only!")}
              disabled={!shippingAddress || !email || !phoneNumber}
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-semibold disabled:bg-gray-400"
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
