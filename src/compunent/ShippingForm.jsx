import React, { useState, useEffect } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin } from "lucide-react";
import { FaMapMarkerAlt, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

const ShippingForm = ({
  onNext,
  formData,
  setFormData,
  errors,
  setErrors,
  authUser,
}) => {
  const [localFormData, setLocalFormData] = useState({
    fullName: authUser?.username || formData.fullName || "",
    email: authUser?.email || formData.email || "",
    phoneNumber: formData.phoneNumber || "",
    shippingAddress: formData.shippingAddress || "",
  });
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    setLocalFormData({
      fullName: authUser?.username || formData.fullName || "",
      email: authUser?.email || formData.email || "",
      phoneNumber: formData.phoneNumber || "",
      shippingAddress: formData.shippingAddress || "",
    });
  }, [authUser, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData({ ...localFormData, [name]: value });

    if (name === "phoneNumber") {
      const phoneRegex = /^\+?\d{10,15}$/;
      if (!phoneRegex.test(value)) {
        setPhoneError("Phone number must be 10-15 digits, optional + prefix");
      } else {
        setPhoneError("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!localFormData.fullName) newErrors.fullName = "Full name is required";
    if (!localFormData.email) newErrors.email = "Email is required";
    if (!localFormData.phoneNumber || phoneError)
      newErrors.phoneNumber = phoneError || "Phone is required";
    if (!localFormData.shippingAddress)
      newErrors.shippingAddress = "Shipping address is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setFormData({
        ...formData,
        fullName: localFormData.fullName,
        email: localFormData.email,
        phoneNumber: localFormData.phoneNumber,
        shippingAddress: localFormData.shippingAddress,
      });
      onNext();
    }
  };

  return (
    <div className="py-6 px-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button className="text-gray-600 hover:text-black">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-semibold flex-1 text-center">Checkout</h1>
        <div className="w-6" /> {/* spacing */}
      </div>

      {/* Stepper */}
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="mb-6">
          <label
            htmlFor="fullName"
            className="block text-gray-600 mb-2 font-semibold tracking-wide"
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
              name="fullName"
              value={localFormData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name..."
              disabled={!!authUser?.username}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border 
                   bg-white/80  shadow
                   placeholder-gray-400
                   focus:border-transparent focus:ring-2 focus:ring-primary/70 
                   focus:shadow-lg focus:shadow-primary/20
                   hover:shadow-md hover:border-gray-300
                   outline-none transition-all duration-300
                   disabled:bg-gray-100 disabled:cursor-not-allowed 
                   text-dark font-medium
                   ${
                     errors.fullName
                       ? "border-red-500 focus:ring-red-500 focus:shadow-red-200"
                       : "border-gray-200"
                   }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-2 font-semibold tracking-wide">
            Email Address
          </label>
          <div className="relative group">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              type="email"
              name="email"
              value={localFormData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              disabled={!!authUser?.email}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border 
                   bg-white/80 shadow
                   placeholder-gray-400
                   focus:border-transparent focus:ring-2 focus:ring-primary/70 
                   focus:shadow-lg focus:shadow-primary/20
                   hover:shadow-md hover:border-gray-300
                   outline-none transition-all duration-300
                   disabled:bg-gray-100 disabled:cursor-not-allowed 
                   text-dark font-medium
                   ${
                     errors.email
                       ? "border-red-500 focus:ring-red-500 focus:shadow-red-200"
                       : "border-gray-200"
                   }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-2 font-semibold tracking-wide">
            Phone Number
          </label>
          <div className="relative group">
            <Phone
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              type="tel"
              name="phoneNumber"
              value={localFormData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number (e.g., +923001234567)"
              className={`w-full pl-12 pr-4 py-3 rounded-xl border 
                    bg-white/80 shadow
                    placeholder-gray-400
                    focus:border-transparent focus:ring-2 focus:ring-primary/70 
                    focus:shadow-lg focus:shadow-primary/20
                    hover:shadow-md hover:border-gray-300
                    outline-none transition-all duration-300
                    text-dark font-medium
                    ${
                      errors.phoneNumber || phoneError
                        ? "border-red-500 focus:ring-red-500 focus:shadow-red-200"
                        : "border-gray-200"
                    }`}
            />
          </div>
          {(errors.phoneNumber || phoneError) && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phoneNumber || phoneError}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-2 font-semibold tracking-wide">
            Shipping Address
          </label>
          <div className="relative group">
            <MapPin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              type="text"
              name="shippingAddress"
              value={localFormData.shippingAddress}
              onChange={handleChange}
              placeholder="Enter shipping address"
              className={`w-full pl-12 pr-4 py-3 rounded-xl border 
                   bg-white/80 shadow
                   placeholder-gray-400
                   focus:border-transparent focus:ring-2 focus:ring-primary/70 
                   focus:shadow-lg focus:shadow-primary/20
                   hover:shadow-md hover:border-gray-300
                   outline-none transition-all duration-300
                   text-dark font-medium
                   ${
                     errors.shippingAddress
                       ? "border-red-500 focus:ring-red-500 focus:shadow-red-200"
                       : "border-gray-200"
                   }`}
            />
          </div>
          {errors.shippingAddress && (
            <p className="text-red-500 text-sm mt-1">
              {errors.shippingAddress}
            </p>
          )}
        </div>

        {/* Continue Button */}
        <div className="sticky bottom-0 left-0 right-0 bg-white pt-4 pb-2 mt-6">
          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={Object.keys(errors).length > 0 || phoneError}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;
