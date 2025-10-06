// src/compunent/PaymentForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createOrder } from "../features/cart/cartSlice";
import axios from "axios";
import { ArrowLeft, Tag } from "lucide-react";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaMoneyBillAlt,
} from "react-icons/fa";

const PaymentForm = ({
  onBack,
  onNext,
  setOrderData,
  formData,
  setFormData,
  authUser,
  guestId,
  displayCart,
}) => {
  const dispatch = useDispatch();
  const reduxCart = useSelector((state) => state.cart.items);
  const cart = displayCart || reduxCart;

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [agree, setAgree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [isValidDiscount, setIsValidDiscount] = useState(false);
  const [discountMessage, setDiscountMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    setDiscountCode(formData.discountCode || "");
    setIsValidDiscount(formData.isValidDiscount || false);
    if (formData.discountCode && formData.isValidDiscount) {
      setDiscountMessage("10% discount applied!");
    }
  }, [formData]);

  useEffect(() => {
    console.log("PaymentForm - Cart items:", cart);
  }, [cart]);

  const getStock = (item) => {
    if (!item.product_id && !item._id) {
      console.warn("PaymentForm - Missing product_id or _id for item:", item);
      return 0;
    }
    const product = item.product_id || item;
    if (product.sizes?.length > 0) {
      if (!item.selected_size) {
        console.warn(
          `PaymentForm - Missing selected_size for size-based product: ${product.product_name}`
        );
        return 0;
      }
      const size = product.sizes.find((s) => s.size === item.selected_size);
      if (!size) {
        console.warn(
          `PaymentForm - Size ${item.selected_size} not found for product ${product.product_name}`
        );
        return 0;
      }
      return size.stock || 0;
    }
    return product.product_stock || 0;
  };

  const validatePhone = (value) => {
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(value)) {
      setPhoneError("Phone number must be 10-15 digits, optional + prefix");
    } else {
      setPhoneError("");
    }
  };

  useEffect(() => {
    if (formData.phoneNumber) {
      validatePhone(formData.phoneNumber);
    }
  }, [formData.phoneNumber]);

  const calculateSubtotal = () => {
    return Array.isArray(cart)
      ? cart.reduce((total, item) => {
          const price =
            item.product_id?.product_discounted_price ||
            item.product_discounted_price ||
            0;
          const qty = item.quantity || 1;
          return total + price * qty;
        }, 0)
      : 0;
  };

  const calculateShipping = () => {
    return Array.isArray(cart)
      ? cart.reduce((total, item) => {
          const product = item.product_id || item;
          const shipping = product.shipping || 0;
          const qty = item.quantity || 1;
          return total + shipping * qty;
        }, 0)
      : 0;
  };

  const handleDiscountCodeChange = async (e) => {
    const code = e.target.value.toUpperCase().trim();
    setDiscountCode(code);

    if (code) {
      if (!formData.email && !authUser?.email) {
        setIsValidDiscount(false);
        setDiscountMessage(
          "Please enter an email address to apply a discount code"
        );
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3003/api/users/validate-discount",
          { email: formData.email || authUser?.email, code }
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

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const originalTotal = subtotal + shipping;
  const discountedSubtotal = isValidDiscount
    ? Math.round(subtotal * 0.9 * 100) / 100
    : subtotal;
  const grandTotal = discountedSubtotal + shipping;
  const discountAmount = subtotal - discountedSubtotal;

  const handlePlaceOrder = async () => {
    if (!agree) {
      toast.error("Please agree to Terms and Conditions first", {
        position: "top-right",
      });
      return;
    }
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
    if (
      cart.some(
        (item) =>
          (item.product_id?.sizes?.length > 0 || item.sizes?.length > 0) &&
          !item.selected_size
      )
    ) {
      toast.error("Please select a size for all size-based products", {
        position: "top-right",
      });
      return;
    }
    if (cart.some((item) => getStock(item) < (item.quantity || 1))) {
      toast.error("One or more items are out of stock", {
        position: "top-right",
      });
      return;
    }

    setIsSubmitting(true);

    const orderDataToSend = {
      products: cart.map((item) => ({
        product_id: item.product_id?._id || item.product_id || item._id,
        quantity: item.quantity || 1,
        selected_image: item.selected_image,
        selected_size: item.selected_size,
      })),
      total_amount: subtotal,
      shipping_address: formData.shippingAddress,
      order_email: formData.email,
      phone_number: formData.phoneNumber,
      full_name: formData.fullName,
      guestId,
      discount_code: isValidDiscount ? discountCode : undefined,
    };

    try {
      const result = await dispatch(createOrder(orderDataToSend)).unwrap();
      toast.success("Order placed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setFormData({
        ...formData,
        fullName: authUser?.username || "",
        email: authUser?.email || "",
        phoneNumber: "",
        shippingAddress: "",
        discountCode: "",
        isValidDiscount: false,
      });
      setIsValidDiscount(false);
      setDiscountMessage("");
      setOrderData(result);
      onNext();
    } catch (err) {
      toast.error(err?.message || err || "Failed to place order", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-5 max-w-lg mx-auto bg-white rounded-2xl shadow-xl">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-black transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-semibold flex-1 text-center bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
          Checkout
        </h1>
        <div className="w-6" />
      </div>

      <div className="flex items-center justify-between mb-12 w-full max-w-2xl mx-auto">
        <div className="flex ">
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

      <h3 className="text-xs font-medium tracking-wider text-gray-500 mb-1">
        STEP 2
      </h3>
      <h2 className="text-2xl font-bold mb-6">Payment</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { type: "cash", label: "Cash", icon: <FaMoneyBillAlt /> },
          { type: "credit", label: "Card", icon: <FaCreditCard /> },
          {
            type: "other",
            label: "Other",
            icon: <span className="text-xl">⋯</span>,
          },
        ].map((method) => (
          <button
            key={method.type}
            onClick={() => setPaymentMethod(method.type)}
            className={`flex flex-col items-center p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
              paymentMethod === method.type
                ? "border-black bg-gray-50 shadow-md scale-105"
                : "border-gray-200 hover:border-black hover:bg-gray-50"
            }`}
          >
            <div className="mb-1 text-lg">{method.icon}</div>
            {method.label}
          </button>
        ))}
      </div>

      {(paymentMethod === "credit" || paymentMethod === "other") && (
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
            Payment method{" "}
            <span className="font-semibold mx-1 capitalize">
              {paymentMethod}
            </span>{" "}
            coming soon!
          </div>
        </div>
      )}

      {paymentMethod === "credit" && (
        <div className="">
          <div className="mb-6">
            <img
              src="https://www.visa.co.in/dam/VCOM/regional/ap/india/global-elements/images/in-visa-gold-card-498x280.png"
              alt="Credit card"
              className="rounded-xl w-[60%] mx-auto"
            />
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-600 my-7 text-">
              Or check out with
            </p>
            <div className="flex gap-5 items-center justify-center flex-wrap">
              {[
                {
                  src: "https://www.logo.wine/a/logo/PayPal/PayPal-Logo.wine.svg",
                  alt: "PayPal",
                },
                {
                  src: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
                  alt: "Visa",
                },
                {
                  src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
                  alt: "Mastercard",
                },
                {
                  src: "https://upload.wikimedia.org/wikipedia/commons/1/16/Alipay_logo.svg",
                  alt: "Alipay",
                },
                {
                  src: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
                  alt: "Amex",
                },
              ].map((logo, i) => (
                <img
                  key={i}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-7 hover:scale-110 transition-transform cursor-pointer drop-shadow-md"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {authUser && (
        <div className="mb-6">
          <label className="block text-gray-600 mb-2 font-semibold tracking-wide">
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

      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-dark mb-2">Order Items:</h4>
        {cart.map((item) => {
          const product = item.product_id || item;
          const isSizeMissing =
            product.sizes?.length > 0 && !item.selected_size;
          return (
            <div
              key={`${item.product_id?._id || item._id || item.product_id}-${
                item.selected_image
              }-${item.selected_size}`}
              className="flex justify-between text-sm text-dark py-1 border-b border-gray-200 last:border-b-0"
            >
              <span className="truncate">
                {item.quantity || 1}x {product.product_name || "Product"}
                {item.selected_size && ` (Size: ${item.selected_size})`}
                {isSizeMissing && (
                  <span className="text-red-500 ml-2">(Select size)</span>
                )}
              </span>
              <span className="font-medium">
                Rs.{" "}
                {(product.product_discounted_price || 0) * (item.quantity || 1)}
              </span>
            </div>
          );
        })}
      </div>
      <hr className="my-4" />
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Product Price:</span>
          <span>Rs. {subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping:</span>
          <span>Rs. {shipping}</span>
        </div>
        {isValidDiscount && (
          <>
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount (10%):</span>
              <span>-Rs. {discountAmount}</span>
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
            Rs. {grandTotal}
          </span>
        </div>
      </div>

      <div className="flex items-start mb-6">
        <input
          type="checkbox"
          checked={agree}
          onChange={() => setAgree(!agree)}
          className="mr-3 w-4 h-4 border-gray-400 rounded"
        />
        <p className="text-sm text-gray-600 leading-snug">
          I agree to{" "}
          <a href="#" className="text-blue-600 underline font-medium">
            Terms and conditions
          </a>
        </p>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={
          isSubmitting ||
          !agree ||
          paymentMethod !== "cash" ||
          !formData.fullName ||
          !formData.shippingAddress ||
          !formData.email ||
          !formData.phoneNumber ||
          phoneError ||
          cart.some((item) => getStock(item) < (item.quantity || 1)) ||
          cart.some((item) => {
            const product = item.product_id || item;
            return product.sizes?.length > 0 && !item.selected_size;
          })
        }
        className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2
    ${
      paymentMethod !== "cash"
        ? "bg-gray-400 cursor-not-allowed text-gray-100"
        : "bg-primary hover:bg-primary/90 text-white"
    }`}
      >
        {paymentMethod !== "cash" ? (
          <>
            <svg
              className="w-4 h-4 mr-2 text-yellow-300 animate-bounce"
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
            Coming Soon
          </>
        ) : isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Placing Order...
          </>
        ) : (
          "PLACE ORDER (Cash on Delivery)"
        )}
      </button>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
        <p className="font-medium mb-1">Payment Method: Cash on Delivery</p>
        <p className="text-xs">Pay Rs. {grandTotal} to the delivery person</p>
      </div>
    </div>
  );
};

export default PaymentForm;
