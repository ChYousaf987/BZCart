// Navbar.jsx
import React, { useState, useEffect } from "react";
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

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setLocalSearchTerm] = useState("");

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

  // Fetch cart when user is logged in
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  // Handle input change - real-time search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    dispatch(setSearchTerm(value)); // Dispatch immediately for real-time filtering
  };

  // Handle form submit - optional navigation and validation
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      dispatch(setSearchTerm(""));
      return;
    }
    // If on a different page, navigate to home to show results
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  // Logout
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      dispatch(logoutUser());
      localStorage.removeItem("myUser");
      setIsMenuOpen(false);
      toast.success("Logged out successfully!");
      navigate("/");
    }
  };

  // Get user display name
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

  return (
    <div className="sticky top-0 z-20 font-sans shadow bg-white">
      <div className="bg-gray-100 text-gray-600 text-xs py-2 max-lg:hidden">
        <div className="md:w-[95%] mx-auto px-2 md:px-0 flex justify-between">
          <p>Dinga, Tehsil Kharian District Gujrat, Punjab –Pakistan</p>
          <div className="flex gap-4">
            <span className="cursor-pointer">Eng ▾</span>
            <span className="cursor-pointer">PKR ▾</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between md:w-[95%] mx-auto px-2 md:px-0 items-center py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars size={22} />
          </button>
          <Link to="/">
            <img
              src="/loggg.png"
              alt="logo"
              className="w-[150px] md:w-[200px] object-contain"
            />
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center border border-gray-300 rounded-md overflow-hidden w-1/2"
        >
          <input
            type="text"
            placeholder="Search for products or categories..."
            className="px-3 py-2 w-full outline-none text-sm"
            value={searchTerm}
            onChange={handleSearchChange} // Real-time dispatch here
          />
          <button
            type="submit"
            className="bg-primary text-white px-5 py-2 text-sm font-medium hover:bg-primary"
          >
            Search
          </button>
        </form>

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
              {cartItems.length}
            </span>
          </div>
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-primary"
            >
              {getUserDisplayName()} <FaSignOutAlt size={20} />
            </button>
          ) : (
            <Link to="/auth" className="hover:text-primary">
              <FaRegUser size={20} />
            </Link>
          )}
        </div>
      </div>

      <div className="md:hidden px-4 mt-2 pb-3">
        <form
          onSubmit={handleSearch}
          className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full"
        >
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 w-full outline-none text-sm"
            value={searchTerm}
            onChange={handleSearchChange} // Real-time dispatch here
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary"
          >
            Search
          </button>
        </form>
      </div>

      <div className="bg-black">
        <div className="py-2 hidden md:flex md:w-[95%] mx-auto px-2 md:px-0 text-white items-center gap-9">
          <div className="relative group">
            <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium">
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
          <div className="flex gap-6 text-sm font-medium ml-6">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <Link to="/cart" className="hover:text-primary">
              Shop
            </Link>
            <Link to="/#" className="hover:text-primary">
              Pages
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
            <Link to="/cart" className="block py-1 hover:text-green-400">
              Shop
            </Link>
            <Link to="/pages" className="block py-1 hover:text-green-400">
              Pages
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