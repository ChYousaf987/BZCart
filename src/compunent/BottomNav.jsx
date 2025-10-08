import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GiOpenBook, GiCompass } from "react-icons/gi";
import { MdMenuBook } from "react-icons/md";
import { ImHome } from "react-icons/im";
import {
  FaHome,
  FaList,
  FaPrayingHands,
  FaSearch,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";

const BottomNav = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  const navItems = [
    { path: "/payment", label: "Cart", icon: <FaShoppingCart />, key: "cart" },
    {
      path: "/categories",
      label: "Categories",
      icon: <FaList />,
      key: "categories",
    },
    { path: "/", label: "Home", icon: <FaHome />, key: "home" },
    { path: "/search", label: "Search", icon: <FaSearch />, key: "search" },
    { path: "/auth", label: "Account", icon: <FaUser />, key: "account" },
  ];

  const getIndicatorPosition = (path) => {
    const index = navItems.findIndex((item) => item.path === path);
    return `${(index * 100) / navItems.length + 50 / navItems.length}%`;
  };

  return (
    <div className="fixed md:hidden bottom-0 w-full z-50">
      <div className="relative max-w-md mx-auto backdrop-blur-sm border-t rounded-t-3xl shadow-2xl bg-white border-gray-200 dark:bg-[#1e1e1e] dark:border-gray-700">
        {/* Floating Active Indicator */}
        <div
          className="absolute top-0 w-14 h-14 bg-primary rounded-full shadow-lg transform -translate-y-1/2 flex items-center justify-center transition-all duration-500 ease-out"
          style={{
            left: getIndicatorPosition(active),
            transform: "translateX(-50%) translateY(-50%)",
          }}
        >
          <div className="text-white text-2xl">
            {React.cloneElement(
              navItems.find((item) => item.path === active)?.icon ||
                navItems.find((item) => item.path === "/")?.icon,
              { className: "w-6 h-6" }
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              to={item.path}
              key={item.key}
              onClick={() => setActive(item.path)}
              className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                active === item.path
                  ? "text-primary font-semibold"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <div
                className={`text-xl transition-all duration-300 ${
                  active === item.path
                    ? "opacity-0 scale-0"
                    : "opacity-100 scale-100"
                }`}
              >
                {React.cloneElement(item.icon, { className: "w-6 h-6" })}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
