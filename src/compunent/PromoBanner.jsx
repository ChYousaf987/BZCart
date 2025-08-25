import React from "react";

const PromoBanner = () => {
  return (
    <div className="relative font-cabin text-white py-48 px-4 flex flex-col items-center text-center min-h-[600px] overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="./video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay (optional dark tint) */}
      <div className="absolute inset-0 bg-black/50 "></div>

      {/* Foreground Content */}
      <div className="relative max-w-2xl">
        <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">
          SAVE 20% ON YOUR FIRST ORDER!
        </h2>
        <p className="text-lg sm:text-xl mb-1">
          Subscribe to receive product updates and exclusive
        </p>
        <p className="text-lg sm:text-xl mb-8">
          Delta 8 Resellers coupon codes.
        </p>

        {/* Form */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Enter your Email"
            className="w-full px-5 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button className="bg-gray-900/70 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition-all duration-300">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
