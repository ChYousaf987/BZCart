import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createOrder } from "../features/cart/cartSlice";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Mail, Phone, MapPin, User, Tag } from "lucide-react"; // icons

const Cashout = () => {
  const dispatch = useDispatch();
  const { items: cart } = useSelector((state) => state.cart);
  const { user: authUser } = useSelector((state) => state.auth);

  // Prefill form data for logged-in users
  const [fullName, setFullName] = useState(authUser?.username || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidDiscount, setIsValidDiscount] = useState(false);
  const [discountMessage, setDiscountMessage] = useState("");

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Get guestId from localStorage or generate one
  const guestId = localStorage.getItem("guestId") || `guest_${Date.now()}`;

  useEffect(() => {
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

  const location = useLocation();
  const buyNowProduct = location.state?.buyNowProduct;
  const guestIdFromState = location.state?.guestId;

  // Use this cart for calculation (Buy Now or full cart)
  const displayCart = buyNowProduct ? [buyNowProduct] : cart;

  const calculateTotal = () => {
    return displayCart.reduce(
      (total, item) =>
        total + (item.product_discounted_price || 0) * (item.quantity || 1),
      0
    );
  };

  const handleDiscountCodeChange = async (e) => {
    const code = e.target.value.toUpperCase().trim();
    setDiscountCode(code);

    if (code) {
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

    // Prepare order data from displayCart instead of full cart
    const orderData = {
      products: displayCart.map((item) => ({
        product_id: item.product_id?._id || item._id,
        quantity: item.quantity,
        selected_image: item.selected_image,
      })),
      total_amount: calculateDiscountedTotal(),
      shipping_address: shippingAddress,
      order_email: email,
      phone_number: phoneNumber,
      full_name: fullName,
      guestId: guestIdFromState || guestId,
      discount_code: isValidDiscount ? discountCode : undefined,
    };

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();

      toast.success("Order placed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setOrderPlaced(true);
      setOrderDetails(result);

      // Clear guestId after successful order
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
      <Navbar />

      <div className="md:w-[35%] bg-white p-4 rounded-xl shadow mx-auto my-8">
        <h3 className="text-lg font-bold mb-4 text-dark">Order Summary</h3>
        {/* Full Name */}
        <div className="mb-6">
          <label
            htmlFor="fullName"
            className="block text-dark mb-2 font-bold text-lg tracking-wide"
          >
            Full Name
          </label>
          <div className="relative group">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
              size={22}
            />
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name..."
              disabled={!!authUser?.username}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 
                         bg-white/80  shadow
                         placeholder-gray-400
                         focus:border-transparent focus:ring-2 focus:ring-primary/70 
                         focus:shadow-lg focus:shadow-primary/20
                         hover:shadow-md hover:border-gray-300
                         outline-none transition-all duration-300
                         disabled:bg-gray-100 disabled:cursor-not-allowed 
                         text-dark font-medium"
            />
          </div>
        </div>
        {/* Email */}
        <div className="mb-6">
          <label className="block text-dark mb-2 font-bold text-lg tracking-wide">
            Email Address
          </label>
          <div className="relative group">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              disabled={authUser?.email}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 
                         bg-white/80 shadow
                         placeholder-gray-400
                         focus:border-transparent focus:ring-2 focus:ring-primary/70 
                         focus:shadow-lg focus:shadow-primary/20
                         hover:shadow-md hover:border-gray-300
                         outline-none transition-all duration-300
                         disabled:bg-gray-100 disabled:cursor-not-allowed 
                         text-dark font-medium"
            />
          </div>
        </div>
        {/* Phone */}
        <div className="mb-6">
          <label className="block text-dark mb-2 font-bold text-lg tracking-wide">
            Phone Number
          </label>
          <div className="relative group">
            <Phone
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                validatePhone(e.target.value);
              }}
              placeholder="Enter phone number (10-15 digits)"
              className={`w-full pl-12 pr-4 py-3 rounded-xl border 
                          bg-white/80 shadow
                          placeholder-gray-400
                          focus:border-transparent focus:ring-2 focus:ring-primary/70 
                          focus:shadow-lg focus:shadow-primary/20
                          hover:shadow-md hover:border-gray-300
                          outline-none transition-all duration-300
                          text-dark font-medium
                          ${
                            phoneError
                              ? "border-red-500 focus:ring-red-500 focus:shadow-red-200"
                              : "border-gray-200"
                          }`}
            />
          </div>
          {phoneError && (
            <p className="text-red-500 text-sm mt-1">{phoneError}</p>
          )}
        </div>
        {/* Address */}
        <div className="mb-6">
          <label className="block text-dark mb-2 font-bold text-lg tracking-wide">
            Shipping Address
          </label>
          <div className="relative group">
            <MapPin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter shipping address"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 
                         bg-white/80 shadow
                         placeholder-gray-400
                         focus:border-transparent focus:ring-2 focus:ring-primary/70 
                         focus:shadow-lg focus:shadow-primary/20
                         hover:shadow-md hover:border-gray-300
                         outline-none transition-all duration-300
                         text-dark font-medium"
            />
          </div>
        </div>
        {/* Discount Code */}
        {authUser && (
          <div className="mb-6">
            <label className="block text-dark mb-2 font-bold text-lg tracking-wide">
              Discount Code
            </label>
            <div className="relative group">
              <Tag
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
                size={20}
              />
              <input
                type="text"
                value={discountCode}
                onChange={handleDiscountCodeChange}
                placeholder="Enter your 10% discount code"
                maxLength={8}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 
                           bg-white/80 shadow
                           placeholder-gray-400 tracking-widest uppercase
                           focus:border-transparent focus:ring-2 focus:ring-primary/70 
                           focus:shadow-lg focus:shadow-primary/20
                           hover:shadow-md hover:border-gray-300
                           outline-none transition-all duration-300
                           text-dark font-semibold"
              />
            </div>

            {discountCode && (
              <p
                className={`text-sm mt-2 font-medium transition ${
                  isValidDiscount ? "text-green-600" : "text-red-500"
                }`}
              >
                {discountMessage}
              </p>
            )}
          </div>
        )}
        {/* Order Items */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-dark mb-2">Order Items:</h4>
          {displayCart.map((item) => (
            <div
              key={`${item.product_id?._id || item._id}-${item.selected_image}`}
              className="flex justify-between text-sm text-dark py-1 border-b border-gray-200 last:border-b-0"
            >
              <span className="truncate">
                {item.quantity}x{" "}
                {item.product_id?.product_name ||
                  item.product_name ||
                  "Product"}
              </span>
              <span className="font-medium">
                Rs.{" "}
                {(item.product_id?.product_discounted_price ||
                  item.product_discounted_price ||
                  0) * item.quantity}
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
                <div className="">
                  If you have any question please contect on whatsapp number{" "}
                  <a
                    href="https://wa.me/923297609190?text=Hello%20I%20want%20to%20know%20more%20about%20your%20products"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold underline"
                  >
                    03297609190
                  </a>
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
      <Footer />
    </>
  );
};

export default Cashout;
