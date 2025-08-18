import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerMyUser, userReset } from "../features/users/userSlice";
import OTPModal from "./OTPModal";
import logos from "../assets/logos.png";

const Signup = () => {
  const [showPass, setShowPass] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [formFields, setFormFields] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userLoading, userError, userMessage, userSuccess } = useSelector(
    (state) => state.auth
  );

  const { username, email, password, confirmPassword } = formFields;

  const handleChange = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await dispatch(registerMyUser({ username, email, password }));
  };

  useEffect(() => {
    if (userError) {
      toast.error(userMessage);
      dispatch(userReset());
    }
    if (userSuccess) {
      setShowOTPModal(true);
      toast.success("OTP sent to your email! Awaiting admin approval.");
    }
  }, [userError, userMessage, userSuccess, dispatch]);

  const handleOTPSubmit = () => {
    setShowOTPModal(false);
    dispatch(userReset());
    navigate("/");
  };

  const handleOTPClose = () => {
    setShowOTPModal(false);
    dispatch(userReset());
  };

  return (
    <div className="bg-[#EFF6FF] h-screen flex justify-center items-center">
      <div className="flex flex-col md:flex-row w-[90%] max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px]">
        {/* Left Form */}
        <div className="md:w-1/2 w-full p-10 flex flex-col justify-center gap-5">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            SIGN UP
          </h2>
          <form className="space-y-5" onSubmit={handleRegister}>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={userLoading}
              className="bg-blue-600 text-white py-2 w-full rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {userLoading ? "Registering..." : "Register"}
            </button>
            <p className="text-center text-sm text-gray-700">
              Already have an account?{" "}
              <Link to="/" className="text-blue-500 underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 w-full h-64 md:h-auto relative">
          <div className="absolute right-1 top-1 z-20">
            <img src={logos} alt="logos" className="w-[150px]" />
          </div>
          <img
            src="https://media.istockphoto.com/id/656814364/photo/young-person-vaping-an-e-cig-with-lots-of-clouds-isolated-on-a-dark-background.jpg?s=612x612&w=0&k=20&c=EdUsNTeF9pL2rUWF8zV6yTLRNigw0ty9dGPC_xvReCQ="
            alt="Vape"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <OTPModal
        isOpen={showOTPModal}
        onClose={handleOTPClose}
        onSubmit={handleOTPSubmit}
      />
    </div>
  );
};

export default Signup;
