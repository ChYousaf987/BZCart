import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaUser, FaBars, FaChevronDown } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { CiDeliveryTruck, CiLocationOn } from "react-icons/ci";
import { RiDiscountPercentLine } from "react-icons/ri";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  // Update active state on route change


  // Category → route mapping
  const categoryRoutes = {
    "Shop All": "/cart",
    Clothing: "/E_Liquids",
    Watch: "/watch",
    Shoes: "/watch",
    "Home & Kitchen": "/watch",
    "Beauty & Personal Care": "/watch",
    "Sports & Outdoors": "/watch",
    Groceries: "/watch",
  };

  const categories = [
    { name: "Shop All", sub: ["Trending", "Best Sellers", "New Arrivals"] },
    {
      name: "Watch",
      sub: ["Mobiles", "Laptops", "Headphones", "Cameras"],
    },
    { name: "Clothing", sub: ["Men", "Women", "Kids", "Accessories"] },
    { name: "Shoes", sub: ["Sneakers", "Sandals", "Boots"] },
    { name: "Home & Kitchen", sub: ["Furniture", "Appliances", "Cookware"] },
    { name: "Beauty & Personal Care", sub: ["Makeup", "Skincare", "Haircare"] },
    { name: "Sports & Outdoors", sub: ["Fitness", "Cycling", "Camping"] },
    { name: "Groceries", sub: ["Fresh", "Snacks", "Drinks"] },
    { name: "Home & Kitchen", sub: ["Furniture", "Appliances", "Cookware"] },
    { name: "Beauty & Personal Care", sub: ["Makeup", "Skincare", "Haircare"] },
    { name: "Sports & Outdoors", sub: ["Fitness", "Cycling", "Camping"] },
    { name: "Groceries", sub: ["Fresh", "Snacks", "Drinks"] },
  ];

  const toggleDropdown = (cat) => {
    setOpenDropdown(openDropdown === cat ? null : cat);
  };

  const scrollLeft = () => {
    document.getElementById("category-scroll")?.scrollBy({
      left: -200,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    document.getElementById("category-scroll")?.scrollBy({
      left: 200,
      behavior: "smooth",
    });
  };

  return (
    <div className="sticky top-0 z-20 shadow overflow-x-hidden font-montserrat bg-white">
      {/* Top Header */}
      <header className="bg-light text-dark md:py-1 ">
        <div className=" hidden md:flex justify-between md:justify-between items-center w-[95%] mx-auto">
          <div className="text-dark">Welcome To BZ Cart.store</div>
          <div className="flex gap-5">
            <a
              href="#"
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <CiLocationOn size={17} className="text-primary" />
              Deliver to <span className="text-dark font-semibold">423651</span>
            </a>
            <div className="p-[0.8px] bg-dark/10"></div>
            <a href="#" className="flex items-center gap-2 hover:underline">
              <CiDeliveryTruck size={17} className="text-primary" />
              Track your order
            </a>
            <div className="p-[0.8px] bg-dark/10"></div>
            <a href="#" className="flex items-center gap-2 hover:underline">
              <RiDiscountPercentLine size={17} className="text-primary" />
              All Offers
            </a>
          </div>
        </div>
      </header>

      {/* Main Nav */}
      <div className="flex flex-wrap items-center justify-between md:justify-between bg-white w-[95%] mx-auto">
        <Link
          to="/"
          className="flex  -ms-5 md:-ms-9 items-center gap-4 h-[10vh] md:h-[10vh] overflow-hidden md:w-[20%]  w-[60%]"
        >
          <img src="./log.png" alt="Logoss" className="object-contain" />
        </Link>
        <div className="hidden md:flex items-center bg-primary/10 px-4 py-2 rounded-3xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-primary"
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
            className="bg-transparent w-96 px-2 outline-none text-dark placeholder-dark/50"
          />
        </div>
        <div className="flex gap-10">
          {/* Search Bar */}

          {/* Right Menu */}
          <div className="flex items-center whitespace-nowrap gap-2 md:gap-4 text-dark">
            <Link to="/auth">
              <button className="flex items-center gap-2 text-sm font-medium">
                <FaUser size={20} className="text-primary" />
                <span className="hidden sm:inline text-dark/70">Sign In</span>
              </button>
            </Link>
            <div className="p-[0.8px] h-6 bg-dark/10"></div>
            <Link
              to="/Payment"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <FaShoppingCart size={23} className="text-primary" />
              <span className="hidden sm:inline text-dark/70">Cart</span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-primary text-2xl p-2"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </div>

      {/* Category Bar Desktop */}
      <div className="relative  border-b border-dark/10 hidden md:block w-[95%] mx-auto">
        <div className="relative  mx-auto flex items-center">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 z-10 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition -ml-2"
          >
            <FaChevronDown className="rotate-90 " size={16} />
          </button>

          {/* Scrollable Categories */}
          <div
            id="category-scroll"
            className="flex w-[95%] mx-auto gap-4 px-10 py-3 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {categories.map((cat, idx) => (
              <div key={idx} className="relative flex-shrink-0">
                {categoryRoutes[cat.name] ? (
                  <Link
                    to={categoryRoutes[cat.name]}
                    onClick={() => setActive(cat.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                      active === cat.name
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-dark hover:bg-primary/20"
                    }`}
                  >
                    <span>{cat.name.toUpperCase()}</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setActive(cat.name);
                      toggleDropdown(cat.name);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                      active === cat.name
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-dark hover:bg-primary/20"
                    }`}
                  >
                    <span>{cat.name.toUpperCase()}</span>
                    {cat.sub.length > 0 && <FaChevronDown size={12} />}
                  </button>
                )}

                {openDropdown === cat.name && cat.sub.length > 0 && (
                  <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg p-3 min-w-[180px] z-50">
                    {cat.sub.map((subItem, i) => (
                      <button
                        key={i}
                        className="block w-full text-left px-3 py-2 rounded-md hover:bg-light text-sm text-dark"
                      >
                        {subItem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 z-10 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition -mr-2"
          >
            <FaChevronDown className="-rotate-90" size={16} />
          </button>
        </div>
      </div>

      {/* Category Bar Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-inner px-4 py-3 space-y-2">
          {categories.map((cat, idx) => (
            <div key={idx}>
              {categoryRoutes[cat.name] ? (
                <Link
                  to={categoryRoutes[cat.name]}
                  onClick={() => {
                    setActive(cat.name);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md bg-primary/10 text-dark font-medium"
                >
                  {cat.name}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleDropdown(cat.name)}
                    className="flex justify-between items-center w-full px-3 py-2 rounded-md bg-primary/10 text-dark font-medium"
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
                          className="block w-full text-left px-3 py-1 rounded-md hover:bg-light text-sm text-dark"
                        >
                          {subItem}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
