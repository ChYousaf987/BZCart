import React from "react";
import { Link } from "react-router-dom";

const Essential = () => {
  const categories = [
    {
      name: "Lorem ipsum",
      image:
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      title: "up to 50% off",
    },
    {
      name: "Lorem ipsum",
      image:
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      title: "up to 50% off",
    },
    {
      name: "Lorem ipsum",
      image:
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      title: "up to 50% off",
    },
    {
      name: "Lorem ipsum",
      image:
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      title: "up to 50% off",
    },
    {
      name: "Lorem ipsum",
      image:
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      title: "up to 50% off",
    },
    {
      name: "Lorem ipsum",
      image:
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      title: "up to 50% off",
    },
    {
      name: "Lorem ipsum",
      image:
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      title: "up to 50% off",
    },
    {
      name: "Lorem ipsum",
      image:
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      title: "up to 50% off",
    },
  ];

  return (
    <div className="md:w-[90%] mx-auto px-2 md:px-0 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg md:text-2xl font-bold border-b-2 text-gray-500 border-[#f06621] inline-block pb-1">
          Shop From <span className="text-[#f06621]">Essentials</span>
        </h2>
        <Link
          to="/cart"
          className="text-[#f06621] text-sm sm:text-base font-semibold hover:underline transition"
        >
          View All →
        </Link>
      </div>

      {/* Responsive Grid / Scrollable Row */}
      <div className="flex overflow-x-auto md:overflow-hidden gap-6 sm:gap-10 pb-4 snap-x snap-mandatory scrollbar-hide">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-transparent"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-3xl border border-[#f06621] bg-[#fbf6f4] mt-2 p-1 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <p className="mt-3 text-xs sm:text-sm font-medium hover:text-[#f06621] transition">
              {category.name}
            </p>
            <p className="text-xs sm:text-sm md:text-base font-bold hover:text-[#f06621] transition">
              {category.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Essential;
