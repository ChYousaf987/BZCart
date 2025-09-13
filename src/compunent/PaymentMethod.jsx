import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createOrder } from "../features/cart/cartSlice";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PaymentMethod = () => {
  const dispatch = useDispatch();
  const { items: cart } = useSelector((state) => state.cart);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Order states
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const validatePhone = (value) => {
    if (!/^\d{11}$/.test(value)) {
      setPhoneError("Phone number must be 11 digits");
    } else {
      setPhoneError("");
    }
  };

  // ✅ Calculate cart total
  const calculateTotal = () => {
    return Array.isArray(cart)
      ? cart.reduce(
          (total, item) =>
            total +
            (item.product_id?.product_discounted_price || 0) *
              (item.quantity || 1),
          0
        )
      : 0;
  };

  // ✅ Handle Order Placement
  const handleCheckout = () => {
    if (!fullName || !shippingAddress || !email || !phoneNumber || phoneError) {
      toast.error("Please fill in all fields correctly", {
        position: "top-right",
      });
      return;
    }

    const orderData = {
      products: cart.map((item) => ({
        product_id: item.product_id?._id || item.product_id,
        quantity: item.quantity,
        selected_image: item.selected_image,
      })),
      total_amount: calculateTotal(),
      shipping_address: shippingAddress,
      order_email: email,
      phone_number: phoneNumber,
      full_name: fullName,
    };

    dispatch(createOrder(orderData))
      .unwrap()
      .then((res) => {
        toast.success("✅ Order placed successfully!", {
          position: "top-right",
        });
        setOrderPlaced(true);
        setOrderDetails(res);
        localStorage.removeItem("guestId");
      })
      .catch((err) =>
        toast.error(err || "Failed to place order", { position: "top-right" })
      );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="bg-primary text-white py-6 px-8 text-center">
            <h2 className="text-3xl font-bold tracking-wide">
              Cash on Delivery
            </h2>
            <p className="mt-2 text-sm text-gray-100">
              Fill in your details and confirm your order
            </p>
          </div>

          {/* --- User Details Form --- */}
          <div className="p-8 space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none transition"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none transition"
                placeholder="Enter your email"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  validatePhone(e.target.value);
                }}
                className={`w-full border rounded-lg p-3 focus:ring-2 outline-none transition ${
                  phoneError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-primary"
                }`}
                placeholder="11-digit phone number"
              />
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Shipping Address
              </label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none transition"
                placeholder="Enter complete address"
              />
            </div>
          </div>

          {/* --- Cart Summary --- */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
              Your Order
            </h3>
            {cart.map((item) => (
              <div
                key={`${item.product_id?._id || item._id}-${
                  item.selected_image
                }`}
                className="flex justify-between text-sm text-gray-700 mb-2"
              >
                <span>
                  {item.quantity} × {item.product_id?.product_name || "Product"}
                </span>
                <span className="font-medium text-gray-900">
                  Rs.{" "}
                  {(item.product_id?.product_discounted_price || 0) *
                    item.quantity}
                </span>
              </div>
            ))}

            <hr className="my-3 border-gray-300" />
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span className="text-primary">Rs. {calculateTotal()}</span>
            </div>
          </div>

          {/* --- Checkout / Track Order Buttons --- */}
          <div className="p-6">
            {!orderPlaced ? (
              <button
                onClick={handleCheckout}
                disabled={
                  !fullName ||
                  !shippingAddress ||
                  !email ||
                  !phoneNumber ||
                  phoneError
                }
                className="w-full mt-2 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition disabled:bg-gray-400"
              >
                Place Order
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition"
                >
                  {showDetails ? "Hide Order Details" : "Track Order"}
                </button>

                {showDetails && orderDetails && (
                  <div className="mt-6 bg-gray-100 p-4 rounded-lg border">
                    <h4 className="font-bold text-gray-800 mb-3 text-lg">
                      📦 Order Details
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>
                        <strong>Order ID:</strong> {orderDetails._id}
                      </li>
                      <li>
                        <strong>Name:</strong> {orderDetails.full_name}
                      </li>
                      <li>
                        <strong>Email:</strong> {orderDetails.order_email}
                      </li>
                      <li>
                        <strong>Phone:</strong> {orderDetails.phone_number}
                      </li>
                      <li>
                        <strong>Address:</strong>{" "}
                        {orderDetails.shipping_address}
                      </li>
                      <li>
                        <strong>Total:</strong> Rs. {orderDetails.total_amount}
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentMethod;
