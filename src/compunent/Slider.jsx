import React from "react";
import { FaShippingFast, FaHeadset, FaShieldAlt, FaUndo } from "react-icons/fa";

const HeroSection = () => {
  return (
    <div className="font-sans bg-white">
      {/* 🔹 Hero & Promo Banners */}
      <div className="grid grid-cols-1 w-[95%] mx-auto md:grid-cols-3 gap-6 px-2 md:px-0 pb-10 mt-3">
        {/* Left: Main Hero */}
        <div
          className="md:col-span-2 bg-primary rounded-2xl flex items-center p-8 text-white bg-cover bg-center min-h-[400px] md:min-h-[500px]"
          style={{ backgroundImage: "url('/image.jpg')" }} // ✅ bigger image container
        >
          <div className="max-w-md space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold leading-snug">
              Fresh & Healthy <br /> Organic Food
            </h2>
            <p className="text-base">
              Sale up to{" "}
              <span className="bg-orange-500 text-white px-2 py-1 rounded ml-2 text-sm">
                30% OFF
              </span>
            </p>
            <p className="text-sm text-gray-100">
              Free shipping on all your order.
            </p>
            <button className="mt-4 bg-white text-primary px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition">
              Shop Now →
            </button>
          </div>
        </div>

        {/* Right: Promo Boxes */}
        <div className="space-y-6 flex flex-col">
          {/* Summer Sale */}
          <div
            className="bg-gray-100 rounded-2xl p-6 relative flex-1 flex flex-col justify-center min-h-[200px] md:min-h-[240px] bg-cover bg-right"
            style={{ backgroundImage: "url('/image-2.jpg')" }}
          >
            <h3 className="text-sm uppercase text-end font-semibold">
              Summer Sale
            </h3>
            <p className="text-3xl font-bold text-end text-primary">75% OFF</p>
            <p className="text-xs text-end text-gray-600">
              Only Fruit & Vegetable
            </p>
            <button className="mt-3 text-end text-primary font-semibold text-sm hover:underline">
              Shop Now →
            </button>
          </div>

          {/* Special Deal */}
          <div
            className="relative bg-primary rounded-2xl p-6 flex-1 flex flex-col items-center justify-center text-center text-white bg-cover bg-center min-h-[200px] md:min-h-[240px]"
            style={{ backgroundImage: "url('/image-1.jpg')" }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-sm uppercase">Best Deal</h3>
              <p className="text-xl font-bold">Special Products</p>
              <p className="text-xl font-bold">Deal of the Month</p>
              <button className="mt-3 text-primary bg-white px-4 py-1 rounded-full font-semibold text-sm hover:bg-gray-100">
                Shop Now →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Features Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2 md:px-0 w-[95%] mx-auto pb-10">
        {/* Free Shipping */}
        <div className="flex items-center gap-3">
          <FaShippingFast className="text-primary text-3xl" />
          <div>
            <h4 className="font-semibold">Free Shipping</h4>
            <p className="text-xs text-gray-500">
              Free shipping on all your order
            </p>
          </div>
        </div>

        {/* Customer Support */}
        <div className="flex items-center gap-3">
          <FaHeadset className="text-primary text-3xl" />
          <div>
            <h4 className="font-semibold">Customer Support 24/7</h4>
            <p className="text-xs text-gray-500">Instant access to Support</p>
          </div>
        </div>

        {/* Secure Payment */}
        <div className="flex items-center gap-3">
          <FaShieldAlt className="text-primary text-3xl" />
          <div>
            <h4 className="font-semibold">100% Secure Payment</h4>
            <p className="text-xs text-gray-500">
              We ensure your money is safe
            </p>
          </div>
        </div>

        {/* Money-Back Guarantee */}
        <div className="flex items-center gap-3">
          <FaUndo className="text-primary text-3xl" />
          <div>
            <h4 className="font-semibold">Money-Back Guarantee</h4>
            <p className="text-xs text-gray-500">
              30 Days Money-Back Guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
