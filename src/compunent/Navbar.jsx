import React, { useState, useEffect, useRef } from "react";
import {
  FaShoppingCart,
  FaRegUser,
  FaSignOutAlt,
  FaBars,
  FaChevronDown,
} from "react-icons/fa";
import { SlHandbag } from "react-icons/sl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/users/userSlice";
import { fetchCart } from "../features/cart/cartSlice";
import { setSearchTerm } from "../features/products/productSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { toSlug } from "../utils/slugify";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setLocalSearchTerm] = useState("");
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Total cart items
  const totalCartItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  // Fetch categories
  useEffect(() => {
    axios
      .get("https://bzbackend.online/api/categories/categories")
      .then((res) => {
        const parent = res.data.filter((c) => !c.parent_category);
        const formatted = parent.map((p) => ({
          name: p.name,
          _id: p._id,
          sub: res.data
            .filter((s) => s.parent_category?._id === p._id)
            .map((s) => ({ name: s.name, _id: s._id })),
        }));
        setCategories(formatted);
      })
      .catch(() => toast.error("Failed to fetch categories"));
  }, []);

  // Fetch cart
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  // Search handling
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    dispatch(setSearchTerm(value));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logoutUser());
      localStorage.removeItem("myUser");
      setIsMenuOpen(false);
      toast.success("Logged out successfully!");
      navigate("/");
    }
  };

  const getUserDisplayName = () => {
    if (!user) return null;
    return (
      user.name ||
      user.username ||
      user.fullName ||
      user.firstName ||
      user.email ||
      "User"
    ).slice(0, 15);
  };

  // Toggle category dropdown in mobile
  const toggleCategory = (index) => {
    setOpenCategoryIndex(openCategoryIndex === index ? null : index);
  };

  return (
    <div className="sticky top-0 z-20 font-sans shadow bg-white">
      {/* Sliding Promo Banner */}
      <div className="relative bg-gradient-to-r from-[#7d3d01] via-[#fb3200] to-[#f99304] text-white text-center text-[12px] overflow-hidden py-1 shadow-md">
        <div className="whitespace-nowrap animate-slideBanner">
          ✨ Big Sale Alert! 🎉 Shop above{" "}
          <span className="font-extrabold underline underline-offset-2">
            PKR 5000
          </span>{" "}
          & enjoy <span className="text-yellow-300">Free Delivery</span> 🚚
          across Pakistan 🇵🇰 — Don’t miss out! 🛒
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shine_3s_linear_infinite]" />
      </div>

      {/* Top Info */}
      {/* <div className="bg-gray-100 text-gray-600 text-xs py-1 max-lg:hidden">
        <div className="w-full max-w-7xl mx-auto flex justify-between px-2 md:px-0">
          <p>Dinga, Tehsil Kharian District Gujrat, Punjab – Pakistan</p>
          <div className="flex gap-4">
            <span className="cursor-pointer">Eng ▾</span>
            <span className="cursor-pointer">PKR ▾</span>
          </div>
        </div>
      </div> */}

      {/* Main Navbar */}
      <div className="flex justify-between w-full max-w-7xl mx-auto px-2 md:px-0 items-center py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars size={22} />
          </button>
          <Link to="/">
            <img
              src="/loggo.png"
              alt="logo"
              className="w-[150px] md:w-[200px] object-contain"
            />
          </Link>
        </div>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center border border-gray-300 rounded-md overflow-hidden w-1/2"
        >
          <input
            type="text"
            placeholder="Search for products or categories..."
            className="px-3 py-2 w-full outline-none text-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            type="submit"
            className="bg-primary text-white px-5 py-2 text-sm font-medium hover:bg-primary"
          >
            Search
          </button>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-4 md:gap-6 text-gray-600">
          <div className="text-right hidden md:block">
            <p className="text-xs text-gray-500">Customer Services</p>
            <p className="font-semibold text-sm">+92 329-7609190</p>
          </div>

          <div className="relative">
            <Link to="/payment" className="hover:text-primary">
              <SlHandbag size={22} />
            </Link>
            <span className="absolute -top-2 -right-2 bg-primary text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
              {totalCartItems}
            </span>
          </div>

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-primary"
            >
              {/* 👇 Hide on mobile, show on sm and up */}
              <span className="hidden sm:inline">{getUserDisplayName()}</span>
              <FaSignOutAlt size={20} />
            </button>
          ) : (
            <Link to="/loginprofile" className="hover:text-primary">
              <FaRegUser size={20} />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      {/* <div className="md:hidden px-4 mt-2 pb-3">
        <form
          onSubmit={handleSearch}
          className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full"
        >
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 w-full outline-none text-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary"
          >
            Search
          </button>
        </form>
      </div> */}

      {/* Categories Menu (Desktop) */}
      <div className="bg-black">
        <div className="py-2 hidden md:flex w-full max-w-7xl mx-auto px-2 md:px-0 text-white items-center gap-9">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsCatOpen(!isCatOpen)}
              className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary/90 transition"
            >
              <FaBars /> All Categories <FaChevronDown size={12} />
            </button>

            {isCatOpen && (
              <div className="absolute left-0 top-full bg-white text-gray-800 shadow-2xl rounded-md mt-2 min-w-[250px] z-50 animate-fadeIn">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="relative group/item border-b last:border-none"
                  >
                    <Link
                      to={`/${toSlug(cat.name)}`}
                      className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 transition text-sm font-medium"
                    >
                      {cat.name}
                      {cat.sub.length > 0 && (
                        <FaChevronDown
                          size={10}
                          className="transform rotate-[-90deg] text-gray-500"
                        />
                      )}
                    </Link>
                    {cat.sub.length > 0 && (
                      <div className="absolute left-full top-0 bg-white shadow-xl rounded-md hidden group-hover/item:block min-w-[220px] transition-all">
                        {cat.sub.map((sub) => (
                          <Link
                            key={sub._id}
                            to={`/${toSlug(sub.name)}`}
                            className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-6 text-sm font-medium ml-6">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <Link to="/cart" className="hover:text-primary">
              Shop
            </Link>
            <Link to="/about" className="hover:text-primary">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-primary">
              Contact Us
            </Link>
            <Link to="/privacypolicy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="/returnandrefund" className="hover:text-primary">
              Return & Refund Policy
            </Link>
            <Link to="/termsandconditions" className="hover:text-primary">
              Terms & Conditions
            </Link>
            <Link to="/faqs" className="hover:text-primary">
              FAQS
            </Link>
            <Link to="/orders" className="hover:text-primary">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-md text-white px-6 py-6 space-y-6 border-t border-zinc-800 animate-slideDown">
          {/* Quick Links */}
          <div className="pt-3 border-t border-zinc-800">
            <p className="font-semibold text-lg mb-3 text-primary">
              Quick Links
            </p>
            <div className="flex flex-col space-y-2 text-sm font-medium">
              {[
                { to: "/", label: "Home" },
                { to: "/cart", label: "Shop" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact Us" },
                { to: "/privacypolicy", label: " Privacy Policy" },
                { to: "/returnandrefund", label: " Return & Refund Policy" },
                { to: "/termsandconditions", label: "Terms & Conditions" },
                { to: "/faqs", label: "FAQS" },
                { to: "/orders", label: "Track Order" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="hover:text-green-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Category Section */}
          <div>
            <p className="font-semibold text-lg mb-3 text-primary">
              Shop by Category
            </p>
            <div className="space-y-2">
              {categories.map((cat, index) => (
                <div key={cat._id} className="border-b border-zinc-800 pb-2">
                  <div
                    className="flex justify-between items-center py-1 cursor-pointer hover:text-green-400 transition-colors"
                    onClick={() => toggleCategory(index)}
                  >
                    <span className="text-base flex-1">{cat.name}</span>
                    {cat.sub.length > 0 && (
                      <FaChevronDown
                        className={`transition-transform duration-300 ${
                          openCategoryIndex === index
                            ? "rotate-180 text-green-400"
                            : "rotate-0 text-gray-400"
                        }`}
                        size={14}
                      />
                    )}
                  </div>

                  {/* Subcategories */}
                  {cat.sub.length > 0 && openCategoryIndex === index && (
                    <div className="ml-4 text-sm text-gray-400 space-y-1 mt-1">
                      {cat.sub.map((sub) => (
                        <Link
                          key={sub._id}
                          to={`/${toSlug(sub.name)}`}
                          className="block py-1 hover:text-green-400 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
