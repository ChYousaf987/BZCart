import React from "react";
import { Link } from "react-router-dom";

const TopCategories = () => {
  const categories = [
    {
      name: "Lorem ipsum",
      image:
        "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
    },
    {
      name: "Dolor Sit",
      image: "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
    },
    {
      name: "Amet Vape",
      image: "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
    },
    {
      name: "Consectetur",
      image: "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
    },
    {
      name: "Adipiscing",
      image: "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
    },
    {
      name: "Elit Devices",
      image: "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
    },
    {
      name: "Another Item",
      image: "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
    },
  ];

  return (
    <div className=" md:w-[85%] mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg md:text-2xl font-bold text- border-b-2 text-gray-500 border-[#f06621] inline-block pb-1">
          Shop From <span className="text-[#f06621]">Top Categories</span>
        </h2>
        <Link
          to="/cart"
          className="text-[#f06621] text-sm sm:text-base font-semibold hover:underline transition"
        >
          View All →
        </Link>
      </div>

      {/* Scrollable Categories */}
      <div className="flex overflow-x-auto md:overflow-hidden gap-6 sm:gap-10 pb-4 snap-x snap-mandatory scrollbar-hide">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center snap-start flex-shrink-0 w-24 sm:w-36"
          >
            <div className="w-24 h-24 mt-5 sm:w-36 sm:h-36 rounded-full border border-[#f06621]  bg-[#fbf6f4] p-1 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <p className="mt-3 text-sm sm:text-base font-medium text- hover:text-[#f06621] transition">
              {category.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCategories;
