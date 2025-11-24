import React from "react";

const HeroSection = () => {
  return (
    <div className="w-full  flex justify-center py-10 px-4 font-sans">
      {/* MAIN WRAPPER */}
      <div className="w-full max-w-6xl">
        {/* BIG BANNER */}
        <div className="bg-[#F0E6D8] rounded-3xl px-8 md:px-14 py-3 flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm">
          {/* LEFT CONTENT */}
          <div className="flex-1 space-y-4 md:space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#1A1A1A]">
              PREMIUM <br />
              MEN'S <br />
              WATCHES
            </h1>

            <p className="text-lg md:text-xl text-[#1A1A1A] font-medium">
              Starting from <span className="font-bold">Rs. 2,999</span>
            </p>

            <button className="bg-[#E68A42] hover:bg-[#d6762f] text-white px-8 py-3 rounded-full text-lg font-semibold transition-all">
              Shop Now
            </button>
          </div>

          {/* RIGHT WATCH IMAGE */}
          <div className="flex justify-center flex-1">
            <img
              src="https://cdn.shopify.com/s/files/1/0571/6223/6113/files/Sylvi_Watch_Professional_Edge_PU_Collection_Image_Homepage.webp?v=1735719550"
              alt="premium watch"
              className="w-[250px] md:w-[340px] drop-shadow-xl"
            />
          </div>
        </div>

        {/* SMALL 2 BANNERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* MINI BANNER 1 */}
          <div className="bg-[#F0E6D8] rounded-3xl p-6 flex items-center justify-around gap-6 shadow-sm hover:shadow-md transition cursor-pointer">
            <div>
              <h3 className="text-3xl font-semibold text-[#1A1A1A]">
                Men's <br/> Watches
              </h3>
              <p className="text-sm mt-4 text-gray-700">View Collection</p>
            </div>
            <img
              src="https://cdn.shopify.com/s/files/1/0571/6223/6113/files/Sylvi_Watch_Professional_Edge_PU_Collection_Image_Homepage.webp?v=1735719550"
              alt="men watches"
              className="w-20 md:w-24 drop-shadow"
            />
          </div>

          {/* MINI BANNER 2 */}
          <div className="bg-[#F0E6D8] rounded-3xl p-6 flex items-center justify-between gap-6 shadow-sm hover:shadow-md transition cursor-pointer">
            <div>
              <h3 className="text-3xl font-semibold text-[#1A1A1A]">
                Women's <br/> Fashion
              </h3>
              <p className="text-sm mt-4 text-gray-700">View Collection</p>
            </div>
            <img
              src="https://cdn.shopify.com/s/files/1/0571/6223/6113/files/Sylvi_Watch_Professional_Edge_PU_Collection_Image_Homepage.webp?v=1735719550"
              alt="women fashion"
              className="w-20 md:w-24 drop-shadow"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
