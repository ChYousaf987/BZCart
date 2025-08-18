import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "../features/brands/brandSlice";
import { PulseLoader } from "react-spinners";

const TopBrands = () => {
  const dispatch = useDispatch();
  const { brands = [], loading = false, error = null } = useSelector(
    (state) => state.brands || {}
  );

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <PulseLoader size={12} color="#3B82F6" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  if (brands.length === 0) {
    return <div className="text-center py-12">No brands available</div>;
  }

  return (
    <div className="md:w-[85%] mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg md:text-2xl font-bold border-b-2 text-gray-500 border-blue-500 inline-block pb-1">
          Top <span className="text-blue-500"> Vape Brands</span>
        </h2>
        <Link
          to="/cart"
          className="text-blue-500 text-sm sm:text-base font-medium hover:underline transition"
        >
          View All →
        </Link>
      </div>

      {/* Brand Cards */}
      <div className="flex overflow-x-auto gap-5 md:gap-11 pb-6 mt-4 scrollbar-hide snap-x snap-mandatory">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="relative flex items-center w-80 sm:w-96 h-52 flex-shrink-0 rounded-xl snap-start overflow-hidden shadow mt-8 md:hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <img
              src={brand.image}
              alt="Brand"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBrands;