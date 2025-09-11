import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import Loader from "./Loader";

const TopCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://bzbackend.online/api/categories/categories"
        );
        setCategories(response.data);
      } catch (err) {
        console.error(
          "Fetch categories error:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
     <Loader/>
    );
  }

  return (
    <div className="md:w-[95%] mx-auto px-2 md:px-0 ">
      {/* Header */}
      <div className="flex justify-between items-start md:items-center mb-8">
        <h2 className="text-lg md:text-2xl font-bold border-b-2 text-gray-500 border-[#f06621] inline-block pb-1">
          Shop From <span className="text-[#f06621]">Categories</span>
        </h2>
        <Link
          to="/categories"
          className="text-[#f06621] text-sm sm:text-base font-semibold hover:underline transition"
        >
          View All →
        </Link>
      </div>

      {/* Scrollable Categories */}
      {categories.length === 0 ? (
        <p className="text-center w-full">No categories found</p>
      ) : (
        <div className="flex overflow-x-auto md:overflow-hidden gap-6 sm:gap-10 pb-4 snap-x snap-mandatory scrollbar-hide">
          {categories.map((category, index) => (
            <Link
              key={`${category._id}-${index}`}
              to={`/category/${category._id}`}
              className="flex flex-col items-center ml-6 sm:ml-0 text-center snap-start flex-shrink-0 w-24 sm:w-36"
            >
              <div className="w-32 h-32 mt-5 sm:w-36 sm:h-36 rounded-full border border-[#f06621] bg-[#fbf6f4] p-1 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
                <img
                  src={category.image || "https://via.placeholder.com/150"}
                  alt={category.name || "Category"}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-sm sm:text-base font-medium hover:text-[#f06621] transition">
                {category.name || "Unknown Category"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopCategories;
