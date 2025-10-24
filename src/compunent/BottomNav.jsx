import React, { useState, useEffect } from "react";
import { LuPackageSearch } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineViewGrid } from "react-icons/hi";
import { TbTruckDelivery } from "react-icons/tb"; // 🚚 Tracking icon

// 🏠 Ultra-Rounded Home SVG Icon (larger, softer)
const CustomHomeIcon = ({ className = "w-8 h-8", color = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} transition-transform duration-300`}
  >
    <path d="M12 4.5C11.6 4.3 11.2 4.3 10.8 4.5L5 9.2C4.4 9.7 4 10.5 4 11.3V18.5C4 20 5.2 21.2 6.7 21.2H17.3C18.8 21.2 20 20 20 18.5V11.3C20 10.5 19.6 9.7 19 9.2L13.2 4.5C12.8 4.3 12.4 4.3 12 4.5Z" />
    <path d="M8.7 15.3C9.3 16.6 10.5 17.5 12 17.5C13.5 17.5 14.7 16.6 15.3 15.3" />
  </svg>
);

const Compass = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m16.24 7.76-2.5 5.5-5.5 2.5 2.5-5.5 5.5-2.5z" />
  </svg>
);

const BottomNav = () => {
  const location = useLocation();
  const [active, setActive] = useState("/");

  const navItems = [
    { path: "/orders", label: "Tracking", icon: <TbTruckDelivery /> },
    { path: "/cart", label: "Explore", icon: <Compass /> },
    { path: "/", label: "Home", icon: <CustomHomeIcon /> },
    { path: "/categories", label: "Categories", icon: <HiOutlineViewGrid /> },
    { path: "/loginprofile", label: "Profile", icon: <FaRegUser /> },
  ];

  // ✅ Fixed highlight logic
  const getActiveKey = (pathname) => {
    if (pathname === "/") return "/"; // only home page
    if (pathname.startsWith("/categories")) return "/categories";
    if (pathname.startsWith("/orders")) return "/orders";
    if (pathname.startsWith("/cart")) return "/cart";
    if (pathname.startsWith("/profile") || pathname.startsWith("/loginprofile"))
      return "/loginprofile";
    // ❌ don't treat /product, /deal, /search as home
    return ""; // means no active
  };

  useEffect(() => {
    setActive(getActiveKey(location.pathname));
  }, [location.pathname]);

  const getIndicatorPosition = (path) => {
    const index = navItems.findIndex((item) => item.path === path);
    const defaultIndex = 2;
    const positionIndex = index !== -1 ? index : defaultIndex;
    return `${(positionIndex * 100) / navItems.length + 50 / navItems.length}%`;
  };

  return (
    <div className="fixed bottom-2 left-0 w-full flex justify-center z-50 font-daraz md:hidden">
      <div
        className="relative w-[96%]  max-w-md rounded-full h-20 
        bg-white/10 backdrop-blur-xl border border-white/10 
        shadow-[0_8px_25px_rgba(0,0,0,0.25)]
        flex items-center justify-around transition-all duration-300"
      >
        {/* 🔥 Floating Circle Indicator (only shows on main pages) */}
        {active && (
          <div
            className="absolute top-0 z-50 w-16 h-16 bg-primary rounded-full 
            shadow-[0_6px_25px_rgba(242,108,43,0.5)] flex items-center justify-center 
            transition-all duration-500 ease-in-out"
            style={{
              left: getIndicatorPosition(active),
              transform: "translateX(-50%) translateY(-50%)",
            }}
          >
            <div className="text-white">
              {React.cloneElement(
                navItems.find((item) => item.path === active)?.icon ||
                  navItems[0].icon,
                {
                  className:
                    active === "/"
                      ? "w-8 h-8" // 🏠 Home icon larger
                      : "w-6 h-6",
                }
              )}
            </div>
          </div>
        )}

        {/* 💫 Bar curve under floating circle */}
        {active && (
          <div
            className="absolute top-0 w-20 h-10 bg-white/15 backdrop-blur-lg 
            rounded-b-full shadow-[0_4px_12px_rgba(242,108,43,0.25)] 
            border border-white/10 transition-all duration-500"
            style={{
              left: getIndicatorPosition(active),
              transform: "translateX(-50%) translateY(-1px)",
            }}
          ></div>
        )}

        {/* 🧭 Navigation Items */}
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setActive(item.path)}
            className={`flex flex-col items-center justify-center w-full 
              text-center transition-all duration-300 group relative`}
          >
            <div
              className={`transition-all duration-300 transform group-hover:scale-110 
              ${
                active === item.path
                  ? "opacity-0 scale-0"
                  : "opacity-100 scale-100 text-gray-800"
              }`}
            >
              {React.cloneElement(item.icon, {
                className:
                  item.path === "/"
                    ? "w-7 h-7" // Slightly bigger for Home
                    : "w-6 h-6",
              })}
            </div>
            <span
              className={`text-[13px] mt-1 font-semibold tracking-tight 
              ${
                active === item.path
                  ? "text-primary"
                  : "text-gray-800/70 group-hover:text-primary"
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
