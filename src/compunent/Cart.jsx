import React from "react";
import ViewAll from "./ViewAll";
import Navbar from "./Navbar";
import Carts from "./Carts";

const Cart = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="w-[90%] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
            <ViewAll />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <Carts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
