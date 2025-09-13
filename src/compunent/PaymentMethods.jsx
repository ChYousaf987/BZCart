import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createOrder } from "../features/cart/cartSlice";

const PaymentMethod = ({ calculateTotal }) => {
  const dispatch = useDispatch();
  const { items: cart } = useSelector((state) => state.cart);

  // ✅ form state managed locally
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneError, setPhoneError] = useState("");

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
        toast.success("Order placed successfully!", { position: "top-right" });
        setOrderPlaced(true);
        setOrderDetails(res);
        localStorage.removeItem("guestId");
      })
      .catch((err) =>
        toast.error(err || "Failed to place order", { position: "top-right" })
      );
  };

  return (
    <div className="md:w-[35%] bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4 text-dark">Total</h3>

      {/* Full Name */}
      <div className="mb-4">
        <label className="block text-dark mb-2">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-dark/20 rounded-lg p-2"
          placeholder="Enter full name"
        />
      </div>

      {/* Email */}
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

      {/* Phone */}
      <div className="mb-4">
        <label className="block text-dark mb-2">Phone Number</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
            validatePhone(e.target.value);
          }}
          className={`w-full border rounded-lg p-2 ${
            phoneError ? "border-red-500" : "border-dark/20"
          }`}
          placeholder="Enter phone number"
        />
        {phoneError && (
          <p className="text-red-500 text-sm mt-1">{phoneError}</p>
        )}
      </div>

      {/* Address */}
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

      {/* Cart Summary */}
      {cart.map((item) => (
        <div
          key={`${item.product_id?._id || item._id}-${item.selected_image}`}
          className="flex justify-between text-sm text-dark"
        >
          <span>
            {item.quantity} x {item.product_id?.product_name || "Product"}
          </span>
          <span>
            Rs.{" "}
            {(item.product_id?.product_discounted_price || 0) * item.quantity}
          </span>
        </div>
      ))}

      <hr className="my-4" />
      <div className="flex justify-between text-xl font-bold text-dark">
        <span>Due Payment</span>
        <span>Rs. {calculateTotal()}</span>
      </div>

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
          className="w-full mt-4 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-semibold disabled:bg-gray-400"
        >
          PLACE ORDER
        </button>
      ) : (
        <>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
          >
            {showDetails ? "Hide Order Details" : "Track Order"}
          </button>

          {showDetails && orderDetails && (
            <div className="mt-4 bg-gray-100 p-4 rounded-lg">
              <h4 className="font-bold text-dark mb-2">Order Details</h4>
              <p>
                <strong>Order ID:</strong> {orderDetails._id}
              </p>
              <p>
                <strong>Name:</strong> {orderDetails.full_name}
              </p>
              <p>
                <strong>Email:</strong> {orderDetails.order_email}
              </p>
              <p>
                <strong>Phone:</strong> {orderDetails.phone_number}
              </p>
              <p>
                <strong>Address:</strong> {orderDetails.shipping_address}
              </p>
              <p>
                <strong>Total:</strong> Rs. {orderDetails.total_amount}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentMethod;
