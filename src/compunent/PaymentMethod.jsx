import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createOrder } from "../features/cart/cartSlice";
import axios from "axios";
import Footer from "./Footer";
import Navbar from "./Navbar";

const PaymentMethod = () => {
  const dispatch = useDispatch();
  const { items: cart } = useSelector((state) => state.cart);
  const { user: authUser } = useSelector((state) => state.auth); // Get logged-in user

  // Prefill form data for logged-in users
  const [fullName, setFullName] = useState(authUser?.username || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidDiscount, setIsValidDiscount] = useState(false); // Track discount code validity
  const [discountMessage, setDiscountMessage] = useState(""); // Store validation message

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Get guestId from localStorage or generate one
  const guestId = localStorage.getItem("guestId") || `guest_${Date.now()}`;

  useEffect(() => {
    // Set guestId in localStorage if not exists
    if (!localStorage.getItem("guestId")) {
      localStorage.setItem("guestId", guestId);
    }
  }, [guestId]);

  const validatePhone = (value) => {
    if (!/^\+?\d{10,15}$/.test(value)) {
      setPhoneError("Phone number must be valid (10-15 digits)");
    } else {
      setPhoneError("");
    }
  };

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

  const handleDiscountCodeChange = async (e) => {
    const code = e.target.value.toUpperCase().trim();
    setDiscountCode(code);

    if (code) {
      // Check if email is available before making the API call
      if (!email && !authUser?.email) {
        setIsValidDiscount(false);
        setDiscountMessage(
          "Please enter an email address to apply a discount code"
        );
        return;
      }

      try {
        const response = await axios.post(
          "https://bzbackend.online/api/users/validate-discount",
          { email: email || authUser?.email, code }
        );
        if (response.data.isValid) {
          setIsValidDiscount(true);
          setDiscountMessage("10% discount applied!");
        } else {
          setIsValidDiscount(false);
          setDiscountMessage(response.data.message || "Invalid discount code");
        }
      } catch (error) {
        setIsValidDiscount(false);
        setDiscountMessage(
          error.response?.data?.message || "Failed to validate discount code"
        );
      }
    } else {
      setIsValidDiscount(false);
      setDiscountMessage("");
    }
  };

  const calculateDiscountedTotal = () => {
    // Apply 10% discount only if the code is valid
    return isValidDiscount
      ? Math.round(calculateTotal() * 0.9 * 100) / 100
      : calculateTotal();
  };

  const handleCheckout = async () => {
    if (!fullName || !shippingAddress || !email || !phoneNumber || phoneError) {
      toast.error("Please fill in all fields correctly", {
        position: "top-right",
      });
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      products: cart.map((item) => ({
        product_id: item.product_id?._id || item.product_id,
        quantity: item.quantity,
        selected_image: item.selected_image,
      })),
      total_amount: calculateTotal(), // Send original total to backend
      shipping_address: shippingAddress, // Fixed: Use snake_case to match backend
      order_email: email,
      phone_number: phoneNumber,
      full_name: fullName,
      guestId,
      discount_code: isValidDiscount ? discountCode : undefined, // Send discount code only if valid
    };

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();

      toast.success("Order placed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setOrderPlaced(true);
      setOrderDetails(result);

      // Clear cart and guestId after successful order
      localStorage.removeItem("guestId");

      // Reset form
      setFullName(authUser?.username || "");
      setEmail(authUser?.email || "");
      setPhoneNumber("");
      setShippingAddress("");
      setDiscountCode("");
      setIsValidDiscount(false);
      setDiscountMessage("");
    } catch (err) {
      toast.error(err || "Failed to place order", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Navbar/>
      <div className="md:w-[35%] bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4 text-dark">Order Summary</h3>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-dark mb-2 font-medium">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-dark/20 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter full name"
            disabled={authUser?.username}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-dark mb-2 font-medium">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-dark/20 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter email address"
            disabled={authUser?.email}
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-dark mb-2 font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              validatePhone(e.target.value);
            }}
            className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent ${
              phoneError ? "border-red-500" : "border-dark/20"
            }`}
            placeholder="Enter phone number (10-15 digits)"
          />
          {phoneError && (
            <p className="text-red-500 text-sm mt-1">{phoneError}</p>
          )}
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-dark mb-2 font-medium">
            Shipping Address
          </label>
          <input
            type="text"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="w-full border border-dark/20 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter shipping address"
          />
        </div>

        {/* Discount Code */}
        {authUser && (
          <div className="mb-4">
            <label className="block text-dark mb-2 font-medium">
              Discount Code
            </label>
            <input
              type="text"
              value={discountCode}
              onChange={handleDiscountCodeChange}
              className="w-full border border-dark/20 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your 10% discount code"
              maxLength={8}
            />
            {discountCode && (
              <p
                className={`text-sm mt-1 ${
                  isValidDiscount ? "text-green-600" : "text-red-500"
                }`}
              >
                {discountMessage}
              </p>
            )}
          </div>
        )}

        {/* Cart Summary */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-dark mb-2">Order Items:</h4>
          {cart.map((item) => (
            <div
              key={`${item.product_id?._id || item._id}-${item.selected_image}`}
              className="flex justify-between text-sm text-dark py-1 border-b border-gray-200 last:border-b-0"
            >
              <span className="truncate">
                {item.quantity}x {item.product_id?.product_name || "Product"}
              </span>
              <span className="font-medium">
                Rs.{" "}
                {(item.product_id?.product_discounted_price || 0) *
                  item.quantity}
              </span>
            </div>
          ))}
        </div>

        <hr className="my-4" />

        {/* Total Display */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal:</span>
            <span>Rs. {calculateTotal()}</span>
          </div>

          {isValidDiscount && (
            <>
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount (10%):</span>
                <span>
                  -Rs.{" "}
                  {Math.round(
                    (calculateTotal() - calculateDiscountedTotal()) * 100
                  ) / 100}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Code Applied:</span>
                <span className="font-mono">{discountCode}</span>
              </div>
            </>
          )}

          <div className="flex justify-between text-xl font-bold text-dark border-t pt-2">
            <span>Total Amount:</span>
            <span className={isValidDiscount ? "text-green-600" : ""}>
              Rs. {calculateDiscountedTotal()}
            </span>
          </div>
        </div>

        {/* Order Button */}
        {!orderPlaced ? (
          <button
            onClick={handleCheckout}
            disabled={
              isSubmitting ||
              !fullName ||
              !shippingAddress ||
              !email ||
              !phoneNumber ||
              phoneError
            }
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Placing Order...
              </>
            ) : (
              "PLACE ORDER (Cash on Delivery)"
            )}
          </button>
        ) : (
          <>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors mb-3"
            >
              {showDetails
                ? "Hide Order Details"
                : `View Order #${orderDetails?._id?.slice(-6)}`}
            </button>

            {showDetails && orderDetails && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <h4 className="font-bold text-dark mb-3 border-b pb-2">
                  Order Confirmation
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-right">
                    #{orderDetails._id?.slice(-6)}
                  </span>

                  <span className="text-gray-600">Name:</span>
                  <span className="text-right">{orderDetails.full_name}</span>

                  <span className="text-gray-600">Email:</span>
                  <span className="text-right">{orderDetails.order_email}</span>

                  <span className="text-gray-600">Phone:</span>
                  <span className="text-right">
                    {orderDetails.phone_number}
                  </span>

                  <span className="text-gray-600">Address:</span>
                  <span className="text-right">
                    {orderDetails.shipping_address}
                  </span>

                  {orderDetails.discount_code && (
                    <>
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-green-600 text-right font-medium">
                        10% OFF - {orderDetails.discount_code}
                      </span>
                    </>
                  )}

                  <span className="text-gray-600">Total:</span>
                  <span className="text-right font-bold text-lg text-primary">
                    Rs. {orderDetails.total_amount}
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t text-center text-sm text-gray-600">
                  <p>Order Status: {orderDetails.status}</p>
                  <p className="text-xs mt-1">
                    You'll receive a confirmation email shortly
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Payment Info */}
        {!orderPlaced && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <p className="font-medium mb-1">Payment Method: Cash on Delivery</p>
            <p className="text-xs">
              Pay Rs. {calculateDiscountedTotal()} to the delivery person
            </p>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
};

export default PaymentMethod;
