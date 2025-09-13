import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
      {loading ? (
        <div className="flex overflow-x-auto gap-6 sm:gap-10 snap-x snap-mandatory">
          {Array(6)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center ml-4 sm:ml-0 text-center snap-start flex-shrink-0 w-24 sm:w-36"
              >
                <Skeleton circle={true} height={128} width={128} />
                <Skeleton height={20} width={80} className="mt-3" />
              </div>
            ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-center w-full">No categories found</p>
      ) : (
        <div className="flex overflow-x-auto md:overflow-hidden gap-6 sm:gap-10 snap-x snap-mandatory scrollbar-hide">
          {categories.map((category, index) => (
            <Link
              key={`${category._id}-${index}`}
              to={`/category/${category._id}`}
              className="flex flex-col items-center ml-4 sm:ml-0 text-center snap-start flex-shrink-0 w-24 sm:w-36"
            >
              <div className="w-32 h-32 mt-5 ml-8 md:ml-2 sm:w-36 sm:h-36 rounded-full border border-[#f06621] bg-[#fbf6f4] p-1 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
                <img
                  src={category.image || "https://via.placeholder.com/150"}
                  alt={category.name || "Category"}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-sm ml-8 md:ml-2 sm:text-base font-medium hover:text-[#f06621] transition">
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
