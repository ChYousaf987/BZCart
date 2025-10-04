import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ShippingForm from "./ShippingForm";
import PaymentForm from "./PaymentForm";
import TrackOrders from "./TrackOrders";
import { ArrowLeft } from "lucide-react";
import { FaMapMarkerAlt, FaCreditCard, FaCheckCircle } from "react-icons/fa";

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    shippingAddress: "",
  });
  const [errors, setErrors] = useState({});

  const { user: authUser } = useSelector((state) => state.auth);
  const guestId = localStorage.getItem("guestId") || `guest_${Date.now()}`;

  useEffect(() => {
    if (!localStorage.getItem("guestId")) {
      localStorage.setItem("guestId", guestId);
    }
  }, [guestId]);

  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: authUser.username || prev.fullName,
        email: authUser.email || prev.email,
      }));
    }
  }, [authUser]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="md:w-[35%] font-daraz bg-white p-4 rounded-xl shadow">
      {step === 1 && (
        <ShippingForm
          onNext={nextStep}
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          authUser={authUser}
        />
      )}
      {step === 2 && (
        <PaymentForm
          onBack={prevStep}
          onNext={nextStep}
          setOrderData={setOrderData}
          formData={formData}
          setFormData={setFormData}
          authUser={authUser}
          guestId={guestId}
        />
      )}
      {step === 3 && (
        <TrackOrders
          orderData={orderData}
          formData={formData}
          authUser={authUser}
        />
      )}
    </div>
  );
};

export default Checkout;
