import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaList,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaTruck,
} from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { Link, useLocation } from "react-router-dom";

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
    { path: "/", label: "Home", icon: <GoHomeFill />, key: "home" },
    {
      path: "/orders",
      label: "Tracking",
      icon: <FaTruck />, // Replaced FaSearch with FaTruck for tracking
      key: "tracking",
    },
    { path: "/auth", label: "Account", icon: <FaUser />, key: "account" },
  ];

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const getIndicatorPosition = (path) => {
    const index = navItems.findIndex((item) => item.path === path);
    const defaultIndex = 0;
    const positionIndex = index !== -1 ? index : defaultIndex;
    return `${(positionIndex * 100) / navItems.length + 50 / navItems.length}%`;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center z-40 md:hidden">
      <div className="relative w-[100%] max-w-md bg-white backdrop-blur-md h-20 flex items-center justify-around shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-white/10 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
        {/* Floating Circle */}
        <div
          className="absolute top-0 z-50 w-16 h-16 bg-primary rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-500 ease-in-out glow-effect"
          style={{
            left: getIndicatorPosition(active),
            transform: "translateX(-50%) translateY(-50%)",
          }}
        >
          <div className="text-white text-2xl">
            {React.cloneElement(
              navItems.find((item) => item.path === active)?.icon ||
                navItems[0].icon,
              { className: "w-8 h-8" }
            )}
          </div>
        </div>

        {/* Bar curve under floating circle */}
        <div
          className="absolute top-0 w-20 h-10 bg-gray-200 backdrop-blur-md rounded-b-full transition-all duration-500"
          style={{
            left: getIndicatorPosition(active),
            transform: "translateX(-50%) translateY(-1px)",
          }}
        ></div>

        {/* Navigation Items */}
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setActive(item.path)}
            className={`flex flex-col items-center justify-center w-full text-center transition-all duration-300 group hover:-translate-y-1 ${
              active === item.path
                ? "text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            <div
              className={`text-xl transition-all duration-300 transform group-hover:scale-110 ${
                active === item.path
                  ? "opacity-0 scale-0"
                  : "opacity-100 scale-100"
              }`}
            >
              {React.cloneElement(item.icon, { className: "w-5 h-5" })}
            </div>
            <span className="text-[13px] mt-1 font-semibold tracking-tight group-hover:text-blue-500 transition-colors duration-200">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
