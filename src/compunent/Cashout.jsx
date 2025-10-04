import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ShippingForm from "./ShippingForm";
import PaymentForm from "./PaymentForm";
import TrackOrders from "./TrackOrders";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Cashout = () => {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    shippingAddress: "",
    discountCode: "",
    isValidDiscount: false,
  });
  const [errors, setErrors] = useState({});

  const { user: authUser, items: cart } = useSelector((state) => state.auth);
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
    <>
      <Navbar />
      <div className="md:w-[35%] font-daraz bg-white p-4 rounded-xl shadow mx-auto mb-8">
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
            guestId={guestIdFromState || guestId}
            displayCart={displayCart}
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
      <Footer />
    </>
  );
};

export default Cashout;