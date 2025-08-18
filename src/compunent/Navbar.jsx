import React, { useState } from "react";
import { FaShoppingCart, FaUser, FaBars, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { CiDeliveryTruck, CiLocationOn } from "react-icons/ci";
import { RiDiscountPercentLine } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(location.pathname);

  // Dummy user (frontend only)
  const user = { username: "JohnDoe" }; // change null if you want to show logged-out state

  // Dummy categories (frontend only)
  const categories = [
    // Electronics
    { _id: "1", name: "Electronics" },
    { _id: "10", name: "Laptops", parent_category: { _id: "1" } },
    { _id: "11", name: "Smartphones", parent_category: { _id: "1" } },
    { _id: "12", name: "Cameras", parent_category: { _id: "1" } },

    // Clothing
    { _id: "2", name: "Clothing" },
    { _id: "20", name: "Men's Wear", parent_category: { _id: "2" } },
    { _id: "21", name: "Women's Wear", parent_category: { _id: "2" } },
    { _id: "22", name: "Kids' Wear", parent_category: { _id: "2" } },

    // Shoes
    { _id: "3", name: "Shoes" },
    { _id: "30", name: "Sneakers", parent_category: { _id: "3" } },
    { _id: "31", name: "Formal Shoes", parent_category: { _id: "3" } },
    { _id: "32", name: "Sandals", parent_category: { _id: "3" } },

    // Home & Kitchen
    { _id: "4", name: "Home & Kitchen" },
    { _id: "40", name: "Furniture", parent_category: { _id: "4" } },
    { _id: "41", name: "Cookware", parent_category: { _id: "4" } },
    { _id: "42", name: "Decor", parent_category: { _id: "4" } },

    // Beauty & Personal Care
    { _id: "5", name: "Beauty & Personal Care" },
    { _id: "50", name: "Skincare", parent_category: { _id: "5" } },
    { _id: "51", name: "Makeup", parent_category: { _id: "5" } },
    { _id: "52", name: "Hair Care", parent_category: { _id: "5" } },

    // Sports & Outdoors
    { _id: "6", name: "Sports & Outdoors" },
    { _id: "60", name: "Fitness Equipment", parent_category: { _id: "6" } },
    { _id: "61", name: "Outdoor Gear", parent_category: { _id: "6" } },
    { _id: "62", name: "Team Sports", parent_category: { _id: "6" } },

    // Groceries
    { _id: "9", name: "Groceries" },
    { _id: "90", name: "Fruits & Vegetables", parent_category: { _id: "9" } },
    { _id: "91", name: "Beverages", parent_category: { _id: "9" } },
    { _id: "92", name: "Snacks", parent_category: { _id: "9" } },
  ];

  const parentCategories = categories.filter((cat) => !cat.parent_category);

  return (
    <div className="sticky top-0 z-20 shadow bg-orange-50">
      {/* Top Header */}
      <header className="bg-gray-100 text-gray-700 py-2 px-4 hidden md:flex justify-between md:justify-around items-center">
        <div className="text-gray-500 md:-ml-20">Welcome To BZ Cart.store</div>
        <div className="flex gap-5 md:-mr-20">
          <a
            href="#"
            className="flex items-center gap-2 text-sm hover:underline"
          >
            <CiLocationOn size={17} className="text-[#f06621]" />
            Deliver to{" "}
            <span className="text-gray-500 font-semibold">423651</span>
          </a>
          <div className="p-[0.8px] bg-gray-200"></div>
          <a href="#" className="flex items-center gap-2 hover:underline">
            <CiDeliveryTruck size={17} className="text-[#f06621]" />
            Track your order
          </a>
          <div className="p-[0.8px] bg-gray-200"></div>
          <a href="#" className="flex items-center gap-2 hover:underline">
            <RiDiscountPercentLine size={17} className="text-[#f06621]" />
            All Offers
          </a>
        </div>
      </header>
      {/* Main Nav */}
      <div className="flex flex-wrap items-center justify-between md:justify-around px-4 sm:px-6">
        <Link to="/home" className="flex my-5 items-center gap-4">
          <img src="./logosss.png" alt="Logo" className="object-contain" />
        </Link>

        <div className="flex gap-10">
          <div className="hidden md:flex items-center bg-[#f9edda] px-4 py-2 rounded-3xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-[#f06621]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search more..."
              className="bg-transparent w-96 px-2 outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="flex items-center whitespace-nowrap gap-2 md:gap-4 text-black">
            <Link to="/" className="">
              <button className="flex items-center gap-2 text-sm font-medium">
                <FaUser className="text-[#f06621]" />
                <span className="hidden sm:inline text-gray-600">Sign In</span>
              </button>
            </Link>
            <div className="p-[0.8px] h-6 bg-gray-200"></div>
            <Link
              to="/payment"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <FaShoppingCart className="text-[#f06621]" />
              <span className="hidden sm:inline text-gray-600">Cart</span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[#f06621] text-2xl p-2"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } flex-col md:flex md:flex-row md:items-center md:justify-center gap-3 px-4 py-4 md:py-3 `}
      >
        <Link
          to="/home"
          className={`${
            activeMenu === "/"
              ? "bg-[#f06621] text-white"
              : "bg-[#f9edda] text-black"
          } flex items-center gap-1 font-semibold px-4 py-2 rounded-full text-sm hover:text-white hover:bg-[#ed824c]`}
          onClick={() => setActiveMenu("/")}
        >
          SHOP ALL
          <IoIosArrowDown size={18} />
        </Link>

        {parentCategories.map((category) => (
          <div key={category._id} className="relative group">
            <Link
              to={`/category/${category._id}`}
              className={`${
                activeMenu === `/category/${category._id}`
                  ? "bg-[#f06621] text-white"
                  : "bg-[#f7ebd9] text-gray-700"
              } flex items-center gap-1 font-semibold px-4 py-2 rounded-full text-sm hover:text-white hover:bg-[#ed824c]`}
              onClick={() => setActiveMenu(`/category/${category._id}`)}
            >
              {category.name.toUpperCase()}
              <IoIosArrowDown size={18} />
            </Link>

            {/* Subcategory Dropdown */}
            {categories.filter(
              (subcat) => subcat.parent_category?._id === category._id
            ).length > 0 && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                {categories
                  .filter(
                    (subcat) => subcat.parent_category?._id === category._id
                  )
                  .map((subcat) => (
                    <Link
                      key={subcat._id}
                      to={`/category/${subcat._id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f06621] hover:text-white"
                      onClick={() => setActiveMenu(`/category/${subcat._id}`)}
                    >
                      {subcat.name}
                    </Link>
                  ))}
              </div>
            )}
          </div>
        ))}

        {/* Mobile menu extras */}
        <div className="md:hidden font-semibold px-4 py-2 rounded-full text-sm">
          <a href="#" className="text-gray-500 my-2 flex items-center gap-2">
            <CiLocationOn size={20} className="text-[#f06621]" />
            Deliver to 423651
          </a>
          <a href="#" className="text-gray-500 my-2 flex items-center gap-2">
            <CiDeliveryTruck size={20} className="text-[#f06621]" />
            Track your order
          </a>
          <a href="#" className="text-gray-500 my-2 flex items-center gap-2">
            <RiDiscountPercentLine size={20} className="text-[#f06621]" />
            All Offers
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
