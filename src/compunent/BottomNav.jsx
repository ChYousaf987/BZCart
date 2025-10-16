import React, { useState, useEffect } from "react";
import { LuPackageSearch } from "react-icons/lu";
import { Compass } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineShoppingCart, HiOutlineViewGrid } from "react-icons/hi"; // 🆕 New icons

// 🏠 Custom Home SVG Icon (same as your uploaded one)
const CustomHomeIcon = ({ className = "w-6 h-6", color = "#444" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3L3 9V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9L12 3Z" />
    <path d="M9.5 14C9.8 14.8 10.8 15.5 12 15.5C13.2 15.5 14.2 14.8 14.5 14" />
  </svg>
);

const BottomNav = () => {
  const location = useLocation();
  const [active, setActive] = useState("/");

  const navItems = [
    { path: "/categories", label: "Categories", icon: <HiOutlineViewGrid /> }, // 🗂️ New
    { path: "/payment", label: "Cart", icon: <HiOutlineShoppingCart /> }, // 🛒 New
    { path: "/", label: "Home", icon: <CustomHomeIcon /> }, // 🏠 Custom SVG Icon
    { path: "/orders", label: "Tracking", icon: <LuPackageSearch /> },
    { path: "/profile", label: "Profile", icon: <FaRegUser /> },
  ];

  const getActiveKey = (pathname) => {
    if (pathname === "/") return "/";
    if (pathname.startsWith("/categories")) return "/categories";
    if (pathname.startsWith("/orders")) return "/orders";
    if (pathname.startsWith("/payment")) return "/payment";
    if (pathname.startsWith("/profile") || pathname.startsWith("/auth"))
      return "/profile";
    if (
      pathname.startsWith("/product") ||
      pathname.startsWith("/deal") ||
      pathname.startsWith("/search")
    )
      return "/";
    return "/";
  };

  useEffect(() => {
    setActive(getActiveKey(location.pathname));
  }, [location.pathname]);

  const getIndicatorPosition = (path) => {
    const index = navItems.findIndex((item) => item.path === path);
    const defaultIndex = 2; // Home in center
    const positionIndex = index !== -1 ? index : defaultIndex;
    return `${(positionIndex * 100) / navItems.length + 50 / navItems.length}%`;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center z-50 md:hidden">
      <div
        className="relative w-full max-w-md h-20 flex items-center justify-around 
        bg-white/10 backdrop-blur-xl border-t border-white/10 
        shadow-[0_-5px_25px_rgba(0,0,0,0.4)] rounded-t-3xl "
      >
        {/* Floating Active Circle */}
        <div
          className={`absolute z-50 w-16 h-16 bg-gradient-to-br from-primary to-orange-400 
          rounded-full flex items-center justify-center text-white text-3xl
          transition-all duration-500 ease-in-out animate-orange-glow`}
          style={{
            bottom: "40px",
            left: getIndicatorPosition(active),
            transform: "translateX(-50%)",
          }}
        >
          {React.cloneElement(
            navItems.find((item) => item.path === active)?.icon ||
              navItems[2].icon,
            { className: "w-8 h-8", color: "white" }
          )}
        </div>

        {/* Curved Bar Under Floating Circle */}
        <div
          className="absolute bottom-0 w-20 h-10 bg-gradient-to-t from-primary/30 to-transparent 
          rounded-t-full blur-sm transition-all duration-500"
          style={{
            left: getIndicatorPosition(active),
            transform: "translateX(-50%) translateY(3px)",
          }}
        ></div>

        {/* Nav Items */}
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setActive(item.path)}
            className="relative flex flex-col items-center justify-center w-full text-center 
              transition-all duration-300 group pt-2"
          >
            <div
              className={`text-xl transition-all duration-300 transform ${
                active === item.path
                  ? "opacity-0 scale-0"
                  : "opacity-100 scale-100 text-gray-700 group-hover:text-primary group-hover:scale-110"
              }`}
            >
              {React.cloneElement(item.icon, { className: "w-6 h-6" })}
            </div>
            <span
              className={`text-[12px] mt-1 font-semibold tracking-tight transition-all duration-300 ${
                active === item.path
                  ? "text-primary"
                  : "text-gray-400 group-hover:text-primary"
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Glow Animation */}
      <style jsx>{`
        @keyframes orange-glow {
          0% {
            box-shadow: 0 0 10px rgba(242, 108, 43, 0.6),
              0 0 20px rgba(242, 108, 43, 0.4);
          }
          50% {
            box-shadow: 0 0 25px rgba(242, 108, 43, 0.9),
              0 0 45px rgba(242, 108, 43, 0.6);
          }
          100% {
            box-shadow: 0 0 10px rgba(242, 108, 43, 0.6),
              0 0 20px rgba(242, 108, 43, 0.4);
          }
        }
        .animate-orange-glow {
          animation: orange-glow 2.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BottomNav;
