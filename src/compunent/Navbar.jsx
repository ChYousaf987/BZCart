import React, { useState } from "react";
import { FaShoppingCart, FaUser, FaBars, FaChevronDown } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { CiDeliveryTruck, CiLocationOn } from "react-icons/ci";
import { RiDiscountPercentLine } from "react-icons/ri";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(location.pathname);

  // Dummy user
  const user = { username: "JohnDoe" };

  // Dummy categories
  const categories = [
    {
      name: "Shop All",
      sub: ["Trending", "Best Sellers", "New Arrivals"],
    },
    {
      name: "Electronics",
      sub: ["Mobiles", "Laptops", "Headphones", "Cameras"],
    },
    {
      name: "Clothing",
      sub: ["Men", "Women", "Kids", "Accessories"],
    },
    {
      name: "Shoes",
      sub: ["Sneakers", "Sandals", "Boots"],
    },
    {
      name: "Home & Kitchen",
      sub: ["Furniture", "Appliances", "Cookware"],
    },
    {
      name: "Beauty & Personal Care",
      sub: ["Makeup", "Skincare", "Haircare"],
    },
    {
      name: "Sports & Outdoors",
      sub: ["Fitness", "Cycling", "Camping"],
    },
    {
      name: "Groceries",
      sub: ["Fresh", "Snacks", "Drinks"],
    },
    {
      name: "Home & Kitchen",
      sub: ["Furniture", "Appliances", "Cookware"],
    },
  ];

  const [active, setActive] = useState("Shop All");
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (cat) => {
    setOpenDropdown(openDropdown === cat ? null : cat);
  };

  return (
    <div className="sticky top-0 z-20 shadow bg-orange-50/90">
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
        <Link
          to="/home"
          className="flex my-5 items-center gap-4 md:h-[6vh] md:w-[20%] h-[3vh] w-[60%] "
        >
          <img src="./log.png" alt="Logo" className="object-contain" />
        </Link>

        <div className="flex gap-10">
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-orange-100 px-4 py-2 rounded-3xl">
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

          {/* Right Menu */}
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

      {/* Category Bar */}
      <div className="relative bg-[#] border-b border-gray-200">
        {/* Desktop Categories */}
        <div className="hidden md:flex gap-4 px-4 py-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat, idx) => (
            <div key={idx} className="relative">
              <button
                onClick={() => {
                  setActive(cat.name);
                  toggleDropdown(cat.name);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap font-normal transition-colors ${
                  active === cat.name
                    ? "bg-orange-500 text-white"
                    : "bg-orange-100 text-gray-800 hover:bg-[#eedcc2]"
                }`}
              >
                <span>{cat.name.toUpperCase()}</span>
                {cat.sub.length > 0 && <FaChevronDown size={12} />}
              </button>

              {openDropdown === cat.name && cat.sub.length > 0 && (
                <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg p-3 min-w-[180px] z-50">
                  {cat.sub.map((subItem, i) => (
                    <button
                      key={i}
                      className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700"
                    >
                      {subItem}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Categories (collapsible) */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-inner px-4 py-3 space-y-2">
            {categories.map((cat, idx) => (
              <div key={idx}>
                <button
                  onClick={() => toggleDropdown(cat.name)}
                  className="flex justify-between items-center w-full px-3 py-2 rounded-md bg-[#f7ebd9] text-gray-800 font-medium"
                >
                  {cat.name}
                  {cat.sub.length > 0 && (
                    <FaChevronDown
                      size={12}
                      className={`transition-transform ${
                        openDropdown === cat.name ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {openDropdown === cat.name && (
                  <div className="pl-5 mt-1 space-y-1">
                    {cat.sub.map((subItem, i) => (
                      <button
                        key={i}
                        className="block w-full text-left px-3 py-1 rounded-md hover:bg-gray-100 text-sm text-gray-700"
                      >
                        {subItem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
