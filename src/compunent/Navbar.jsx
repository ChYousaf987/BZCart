import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaRegUser,
  FaBars,
  FaChevronDown,
} from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { SlHandbag } from "react-icons/sl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/users/userSlice";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // 🔹 Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:3003/api/categories/categories")
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

  // 🔹 Logout
  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("myUser");
    setIsMenuOpen(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-20 font-sans  shadow bg-white">
      {/* 🔹 Top bar */}
      <div className="bg-gray-100 text-gray-600 text-xs py-2  max-lg:hidden">
        <div className="md:w-[95%] mx-auto px-2 md:px-0 flex justify-between ">
          <p>Store Location: Lincoln - 344, Illinois, Chicago, USA</p>
          <div className="flex gap-4">
            <span className="cursor-pointer">Eng ▾</span>
            <span className="cursor-pointer">USD ▾</span>
          </div>
        </div>
      </div>

      {/* 🔹 Middle bar */}
      <div className="flex justify-between md:w-[95%] mx-auto px-2 md:px-0 items-center py-4 bg-white border-b">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars size={22} />
        </button>

        {/* Logo */}
        <Link to="/">
          <img
            src="/loggg.png"
            alt="logo"
            className="w-[150px] md:w-[200px] object-contain"
          />
        </Link>

        {/* Search (Desktop only) */}
        <div className="hidden md:flex items-center border border-gray-300 rounded-md overflow-hidden w-1/2">
          <input
            type="text"
            placeholder="Search for products..."
            className="px-3 py-2 w-full outline-none text-sm"
          />
          <button className="bg-primary text-white px-5 py-2 text-sm font-medium hover:bg-primary">
            Search
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6 text-gray-600">
          {/* Contact Info */}
          <div className="text-right hidden md:block">
            <p className="text-xs text-gray-500">Customer Services</p>
            <p className="font-semibold text-sm">(219) 555-0114</p>
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="hover:text-primary relative">
            <CiHeart size={30} />
          </Link>

          {/* Cart */}
          <div className="relative">
            <Link to="/cart" className="hover:text-primary">
              <SlHandbag size={22} />
            </Link>
            <span className="absolute -top-2 -right-2 bg-primary text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </div>

          {/* User */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-primary"
            >
              <FaRegUser size={20} />
            </button>
          ) : (
            <Link to="/auth" className="hover:text-primary">
              <FaRegUser size={20} />
            </Link>
          )}
        </div>
      </div>

      {/* 🔹 Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 w-full outline-none text-sm"
          />
          <button className="bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary">
            Search
          </button>
        </div>
      </div>

      {/* 🔹 Bottom Nav (Desktop) */}
      <div className=" bg-black">
        <div className="py-2 hidden md:flex  md:w-[95%] mx-auto px-2 md:px-0 text-white items-center gap-9">
          {/* Categories Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 bg-primary px-4 py-2 text-sm font-medium">
              <FaBars /> All Categories <FaChevronDown size={12} />
            </button>

            <div className="absolute left-0 top-full bg-white text-black shadow-lg hidden group-hover:block min-w-[220px] z-50">
              {categories.map((cat) => (
                <div key={cat._id} className="relative group/item">
                  <Link
                    to={`/category/${cat._id}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    {cat.name}
                  </Link>
                  {cat.sub.length > 0 && (
                    <div className="absolute left-full top-0 bg-white shadow-lg hidden group-hover/item:block min-w-[180px]">
                      {cat.sub.map((sub) => (
                        <Link
                          key={sub._id}
                          to={`/category/${sub._id}`}
                          className="block px-4 py-2 hover:bg-gray-100"
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

          {/* Links */}
          <div className="flex gap-6 text-sm font-medium ml-6">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <Link to="/shop" className="hover:text-primary">
              Shop
            </Link>
            <Link to="/pages" className="hover:text-primary">
              Pages
            </Link>
            <Link to="/blog" className="hover:text-primary">
              Blog
            </Link>
            <Link to="/about" className="hover:text-primary">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* 🔹 Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black text-white px-6 py-4 space-y-4">
          <div>
            <p className="font-semibold mb-2">Categories</p>
            {categories.map((cat) => (
              <div key={cat._id}>
                <Link
                  to={`/category/${cat._id}`}
                  className="block py-1 hover:text-green-400"
                >
                  {cat.name}
                </Link>
                {cat.sub.length > 0 && (
                  <div className="ml-4 text-sm text-gray-300">
                    {cat.sub.map((sub) => (
                      <Link
                        key={sub._id}
                        to={`/category/${sub._id}`}
                        className="block py-1 hover:text-green-400"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
            <p className="font-semibold mb-2">Menu</p>
            <Link to="/" className="block py-1 hover:text-green-400">
              Home
            </Link>
            <Link to="/shop" className="block py-1 hover:text-green-400">
              Shop
            </Link>
            <Link to="/pages" className="block py-1 hover:text-green-400">
              Pages
            </Link>
            <Link to="/blog" className="block py-1 hover:text-green-400">
              Blog
            </Link>
            <Link to="/about" className="block py-1 hover:text-green-400">
              About Us
            </Link>
            <Link to="/contact" className="block py-1 hover:text-green-400">
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
