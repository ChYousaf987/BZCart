import React from "react";

const HeroSection = () => {
  return (
    <div className="w-full flex justify-center py-5 px-4 font-sans">
      {/* MAIN WRAPPER */}
      <div className="w-full max-w-7xl">
        {/* NEW ARRIVALS LABEL */}

        {/* BIG BANNER */}
        <div className="bg-[#FAF6F1] rounded-3xl overflow-hidden shadow-lg">
          <div
            className="px-4 py-6 md:py-10 md:px-12 
flex flex-row items-center justify-between gap-4 md:gap-10"
          >
            {/* LEFT CONTENT - compact for mobile */}
            <div className="flex-1 space-y-2 md:space-y-6">
              <h1 className="text-xl sm:text-2xl md:text-6xl font-extrabold leading-tight">
                PREMIUM <br />
                MEN'S <br />
                WATCHES
              </h1>

              <p className="text-sm sm:text-base md:text-2xl font-medium">
                Starting from <span className="font-bold">Rs. 2,999</span>
              </p>

              <button
                className="bg-[#E68A42] hover:bg-[#d6762f] text-white 
                       px-5 py-2 sm:px-6 sm:py-2 md:px-8 md:py-3 
                       rounded-full text-sm sm:text-base md:text-lg 
                       font-semibold transition-all"
              >
                Shop Now
              </button>
            </div>

            {/* RIGHT IMAGE - larger on mobile */}
            <div className="flex justify-center flex-1">
              <img
                src="https://cdn.shopify.com/s/files/1/0571/6223/6113/files/Sylvi_Watch_Professional_Edge_PU_Collection_Image_Homepage.webp?v=1735719550"
                alt="premium watch"
                className="w-32 sm:w-40 md:w-72 lg:w-96 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* SMALL 2 BANNERS - stack on mobile, side-by-side on md+ */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-5">
          {/* MINI BANNER 1 */}
          <div
            className="bg-[#FAF6F1] rounded-2xl p-4 flex flex-row 
                  items-center justify-between gap-4 
                  shadow-sm hover:shadow-lg transition cursor-pointer"
          >
            {/* TEXT */}
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-[#1A1A1A] leading-tight">
                Men's <br /> Watches
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
                View Collection
              </p>
            </div>

            {/* IMAGE */}
            <img
              src="https://cdn.shopify.com/s/files/1/0571/6223/6113/files/Sylvi_Watch_Professional_Edge_PU_Collection_Image_Homepage.webp?v=1735719550"
              alt="men watches"
              className="w-20 sm:w-24 md:w-32 object-contain drop-shadow-xl"
            />
          </div>

          {/* MINI BANNER 2 */}
          <div
            className="bg-[#FAF6F1] rounded-2xl p-4 flex flex-row 
                  items-center justify-between gap-4 
                  shadow-sm hover:shadow-lg transition cursor-pointer"
          >
            {/* TEXT */}
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-[#1A1A1A] leading-tight">
                Women's <br /> Fashion
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
                View Collection
              </p>
            </div>

            {/* IMAGE */}
            <img
              src="https://cdn.shopify.com/s/files/1/0571/6223/6113/files/Sylvi_Watch_Professional_Edge_PU_Collection_Image_Homepage.webp?v=1735719550"
              alt="women fashion"
              className="w-20 sm:w-24 md:w-32 object-cover rounded-lg drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
