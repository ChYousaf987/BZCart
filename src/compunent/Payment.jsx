import React from "react";
import Navbar from "./Navbar";
import CartItems from "./CartItems";
import PaymentMethod from "./PaymentMethod";
import { useSelector } from "react-redux";

const Payment = () => {
  const { items: cart } = useSelector((state) => state.cart);

  // ✅ calculateTotal defined here
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

  return (
    <>
      <Navbar />
      <div className="md:w-[98%] mx-auto pt-8 flex flex-col lg:flex-row justify-between gap-6 p-4 min-h-screen bg-light font-montserrat">
        <CartItems />
        {/* ✅ pass calculateTotal */}
        <PaymentMethod calculateTotal={calculateTotal} />
      </div>
    </>
  );
};

export default Payment;
