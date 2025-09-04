import React from "react";
import ViewAll from "./ViewAll";
import Navbar from "./Navbar";
import Carts from "./Carts";

const Cart = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start px-4 md:px-0">
        {/* Cart (Right on desktop, first on mobile) */}
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full order-1 md:order-2">
          <Carts />
        </div>

        {/* Products (Left on desktop, second on mobile) */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-lg order-2 md:order-1">
          <ViewAll />
        </div>
      </div>
    </div>
  );
};

export default Cart;
