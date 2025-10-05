import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createOrder } from "../features/cart/cartSlice";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ArrowLeft, User, Mail, Phone, MapPin, Tag } from "lucide-react";
import { FaMapMarkerAlt, FaCreditCard, FaCheckCircle, FaMoneyBillAlt } from "react-icons/fa";

const Cashout = () => {
  const dispatch = useDispatch();
  const { items: cart } = useSelector((state) => state.cart);
  const { user: authUser } = useSelector((state) => state.auth);
  const location = useLocation();
  const buyNowProduct = location.state?.buyNowProduct;
  const guestIdFromState = location.state?.guestId;

  // Get guestId from localStorage or generate one
  const guestId = localStorage.getItem("guestId") || `guest_${Date.now()}`;

  // State for form data, errors, and step management
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: authUser?.username || "",
    email: authUser?.email || "",
    phoneNumber: "",
    shippingAddress: "",
    discountCode: "",
    isValidDiscount: false,
  });
  const [errors, setErrors] = useState({});

  const { user: authUser } = useSelector((state) => state.auth);
  const { items: cart } = useSelector((state) => state.cart); // Fixed: select from state.cart
  const location = useLocation();
  const buyNowProduct = location.state?.buyNowProduct;
  const guestIdFromState = location.state?.guestId;
  const guestId = localStorage.getItem("guestId") || `guest_${Date.now()}`;
  const displayCart = buyNowProduct ? [buyNowProduct] : cart;

  useEffect(() => {
    if (!localStorage.getItem("guestId")) {
      localStorage.setItem("guestId", guestId);
    }
  }, [guestId]);

  // Prefill form data for logged-in users
  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: authUser.username || prev.fullName,
        email: authUser.email || prev.email,
      }));
    }
  }, [authUser]);

  const validatePhone = (value) => {
    if (!/^\+?\d{10,15}$/.test(value)) {
      setPhoneError("Phone number must be 10-15 digits, optional + prefix");
    } else {
      setPhoneError("");
    }
  };

  const calculateTotal = () => {
    return displayCart.reduce(
      (total, item) =>
        total + (item.product_discounted_price || 0) * (item.quantity || 1),
      0
    );
  };

  const calculateDiscountedTotal = () => {
    return formData.isValidDiscount
      ? Math.round(calculateTotal() * 0.9 * 100) / 100
      : calculateTotal();
  };

  const handleDiscountCodeChange = async (e) => {
    const code = e.target.value.toUpperCase().trim();
    setFormData((prev) => ({ ...prev, discountCode: code }));

    if (code) {
      if (!formData.email && !authUser?.email) {
        setFormData((prev) => ({ ...prev, isValidDiscount: false }));
        setDiscountMessage("Please enter an email address to apply a discount code");
        return;
      }

      try {
        setLoadingDiscount(true);
        const response = await axios.post(
          "https://bzbackend.online/api/users/validate-discount",
          { email: formData.email || authUser?.email, code }
        );
        if (response.data.isValid) {
          setFormData((prev) => ({ ...prev, isValidDiscount: true }));
          setDiscountMessage("10% discount applied!");
        } else {
          setFormData((prev) => ({ ...prev, isValidDiscount: false }));
          setDiscountMessage(response.data.message || "Invalid discount code");
        }
      } catch (error) {
        setFormData((prev) => ({ ...prev, isValidDiscount: false }));
        setDiscountMessage(
          error.response?.data?.message || "Failed to validate discount code"
        );
      } finally {
        setLoadingDiscount(false);
      }
    } else {
      setFormData((prev) => ({ ...prev, isValidDiscount: false }));
      setDiscountMessage("");
    }
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phoneNumber || phoneError)
      newErrors.phoneNumber = phoneError || "Phone number is required";
    if (!formData.shippingAddress)
      newErrors.shippingAddress = "Shipping address is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    }
  };

  const handleCheckout = async () => {
    if (
      !formData.fullName ||
      !formData.shippingAddress ||
      !formData.email ||
      !formData.phoneNumber ||
      phoneError
    ) {
      toast.error("Please fill in all fields correctly", {
        position: "top-right",
      });
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      products: displayCart.map((item) => ({
        product_id: item.product_id?._id || item._id,
        quantity: item.quantity,
        selected_image: item.selected_image,
        selected_size: item.selected_size,
      })),
      total_amount: calculateDiscountedTotal(),
      shipping_address: formData.shippingAddress,
      order_email: formData.email,
      phone_number: formData.phoneNumber,
      full_name: formData.fullName,
      guestId: guestIdFromState || guestId,
      discount_code: formData.isValidDiscount ? formData.discountCode : undefined,
    };

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();
      toast.success("Order placed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setOrderPlaced(true);
      setOrderDetails(result);
      setStep(3);

      localStorage.removeItem("guestId");
      setFormData({
        fullName: authUser?.username || "",
        email: authUser?.email || "",
        phoneNumber: "",
        shippingAddress: "",
        discountCode: "",
        isValidDiscount: false,
      });
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

  const renderShippingForm = () => (
    <div className="py-6 px-4 font-daraz">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button className="text-gray-600 hover:text-black">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-semibold flex-1 text-center">Checkout</h1>
        <div className="w-6" />
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 w-full max-w-2xl mx-auto">
        <div className="flex">
          <FaMapMarkerAlt size={25} className="text-black" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-5">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div key={i} className="w-2 h-1 rounded-full bg-gray-400"></div>
            ))}
        </div>
        <div className="flex text-gray-400">
          <FaCreditCard size={25} />
        </div>
        <div className="flex-1 flex items-center justify-center gap-5">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div key={i} className="w-2 h-1 rounded-full bg-gray-400"></div>
            ))}
        </div>
        <div className="flex text-gray-400">
          <FaCheckCircle size={25} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium tracking-wide text-gray-500 mb-1">
        STEP 1
      </h3>
      <h2 className="text-2xl font-semibold mb-8">Shipping Details</h2>

      {/* Form */}
      <form onSubmit={handleShippingSubmit} className="space-y-8">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              disabled={!!authUser?.username}
              placeholder="Enter your full name"
              className={`w-full border-b py-2 pl-8 pr-2 bg-transparent outline-none transition-all duration-200 ${
                errors.fullName
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-black"
              } disabled:text-gray-500 disabled:border-gray-200`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!!authUser?.email}
              placeholder="Enter your email address"
              className={`w-full border-b py-2 pl-8 pr-2 bg-transparent outline-none transition-all duration-200 ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-black"
              } disabled:text-gray-500 disabled:border-gray-200`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => {
                setFormData({ ...formData, phoneNumber: e.target.value });
                validatePhone(e.target.value);
              }}
              placeholder="Enter phone number (e.g., +923001234567)"
              className={`w-full border-b py-2 pl-8 pr-2 bg-transparent outline-none transition-all duration-200 ${
                errors.phoneNumber || phoneError
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-black"
              }`}
            />
          </div>
          {(errors.phoneNumber || phoneError) && (
            <p className="text-xs text-red-500 mt-1">
              {errors.phoneNumber || phoneError}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Shipping Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={(e) =>
                setFormData({ ...formData, shippingAddress: e.target.value })
              }
              placeholder="Enter your shipping address"
              className={`w-full border-b py-2 pl-8 pr-2 bg-transparent outline-none transition-all duration-200 ${
                errors.shippingAddress
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-black"
              }`}
            />
          </div>
          {errors.shippingAddress && (
            <p className="text-xs text-red-500 mt-1">{errors.shippingAddress}</p>
          )}
        </div>

        {/* Discount */}
        {authUser && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Discount Code (Optional)
            </label>
            <div className="relative">
              <Tag
                className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                name="discountCode"
                value={formData.discountCode}
                onChange={handleDiscountCodeChange}
                placeholder="Enter discount code"
                maxLength={8}
                className="w-full border-b py-2 pl-8 pr-2 bg-transparent uppercase tracking-widest outline-none transition-all duration-200 border-gray-300 focus:border-black"
              />
            </div>
            {discountMessage && (
              <p
                className={`text-xs mt-1 ${
                  formData.isValidDiscount ? "text-green-600" : "text-red-500"
                }`}
              >
                {loadingDiscount ? "Checking code..." : discountMessage}
              </p>
            )}
          </div>
        )}

        {/* Continue */}
        <div className="sticky bottom-0 left-0 right-0 bg-white pt-4 pb-2 mt-6">
          <button
            type="submit"
            disabled={
              !formData.fullName ||
              !formData.email ||
              !formData.phoneNumber ||
              !formData.shippingAddress ||
              phoneError ||
              loadingDiscount ||
              (formData.discountCode && !formData.isValidDiscount)
            }
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="py-8 px-5 max-w-lg mx-auto bg-white rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => setStep(1)}
          className="text-gray-500 hover:text-black transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-semibold flex-1 text-center bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
          Checkout
        </h1>
        <div className="w-6" />
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 w-full max-w-2xl mx-auto">
        <div className="flex">
          <FaMapMarkerAlt size={25} className="text-black" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-5">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div key={i} className="w-2 h-1 rounded-full bg-gray-400"></div>
            ))}
        </div>
        <div className="flex">
          <FaCreditCard size={25} className="text-black" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-5">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div key={i} className="w-2 h-1 rounded-full bg-gray-400"></div>
            ))}
        </div>
        <div className="flex text-gray-400">
          <FaCheckCircle size={25} />
        </div>
      </div>

      {/* Step Title */}
      <h3 className="text-xs font-medium tracking-wider text-gray-500 mb-1">
        STEP 2
      </h3>
      <h2 className="text-2xl font-bold mb-6">Payment</h2>

      {/* Payment Methods */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { type: "cash", label: "Cash", icon: <FaMoneyBillAlt /> },
          { type: "credit", label: "Card", icon: <FaCreditCard /> },
          { type: "other", label: "Other", icon: <span className="text-xl">⋯</span> },
        ].map((method) => (
          <button
            key={method.type}
            onClick={() => toast.info(`Only Cash on Delivery is available`, { position: "top-right" })}
            className={`flex flex-col items-center p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
              method.type === "cash"
                ? "border-black bg-gray-50 shadow-md scale-105"
                : "border-gray-200 hover:border-black hover:bg-gray-50"
            }`}
          >
            <div className="mb-1 text-lg">{method.icon}</div>
            {method.label}
          </button>
        ))}
      </div>

      {/* Show "Coming Soon" for Card or Other */}
      <div className="mb-6 animate-fade-in">
        <div className="bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-3 rounded-lg flex items-center justify-center shadow-sm">
          <svg
            className="w-5 h-5 mr-2 text-yellow-600 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 18a9 9 0 100-18 9 9 0 000 18z"
            />
          </svg>
          Only Cash on Delivery is available
        </div>
      </div>

      {/* Cart Summary */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-dark mb-2">Order Items:</h4>
        {displayCart.map((item) => (
          <div
            key={`${item.product_id?._id || item._id}-${item.selected_image}`}
            className="flex justify-between text-sm text-dark py-1 border-b border-gray-200 last:border-b-0"
          >
            <span className="truncate">
              {item.quantity}x{" "}
              {item.product_id?.product_name || item.product_name || "Product"}
              {item.selected_size && ` (Size: ${item.selected_size})`}
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
        {formData.isValidDiscount && (
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
              <span className="font-mono">{formData.discountCode}</span>
            </div>
          </>
        )}
        <div className="flex justify-between text-xl font-bold text-dark border-t pt-2">
          <span>Total Amount:</span>
          <span className={formData.isValidDiscount ? "text-green-600" : ""}>
            Rs. {calculateDiscountedTotal()}
          </span>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
        <p className="font-medium mb-1">Payment Method: Cash on Delivery</p>
        <p className="text-xs">
          Pay Rs. {calculateDiscountedTotal()} to the delivery person
        </p>
      </div>

      {/* Order Button */}
      <button
        onClick={handleCheckout}
        disabled={
          isSubmitting ||
          !formData.fullName ||
          !formData.shippingAddress ||
          !formData.email ||
          !formData.phoneNumber ||
          phoneError
        }
        className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
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
    </div>
  );

  const renderTrackOrders = () => (
    <div className="py-6 px-4">
      {/* Header */}
      <div className="flex items-center mb-6 justify-center">
        <h1 className="text-lg font-semibold text-center">Order Confirmation</h1>
      </div>

      {/* Stepper - Completed */}
      <div className="flex items-center justify-between mb-12 w-full max-w-2xl mx-auto">
        <div className="flex">
          <FaMapMarkerAlt size={25} className="text-green-500" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-5">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div key={i} className="w-2 h-1 rounded-full bg-green-500"></div>
            ))}
        </div>
        <div className="flex">
          <FaCreditCard size={25} className="text-green-500" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-5">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div key={i} className="w-2 h-1 rounded-full bg-green-500"></div>
            ))}
        </div>
        <div className="flex">
          <FaCheckCircle size={25} className="text-green-500" />
        </div>
      </div>

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
            <span className="text-right">{orderDetails.phone_number}</span>
            <span className="text-gray-600">Address:</span>
            <span className="text-right">{orderDetails.shipping_address}</span>
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
            If you have any question please contact on WhatsApp number{" "}
            <a
              href={`https://wa.me/923297609190?text=Hello%20I%20want%20to%20know%20more%20about%20my%20order%20%23${orderDetails._id?.slice(
                -6
              )}`}
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
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="md:w-[35%] font-daraz bg-white p-4 rounded-xl shadow mx-auto mb-8">
        {step === 1 && renderShippingForm()}
        {step === 2 && renderPaymentForm()}
        {step === 3 && renderTrackOrders()}
      </div>
      <Footer />
    </>
  );
};

export default Cashout;
