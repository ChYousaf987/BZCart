import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaFacebookF,
  FaGoogle,
  FaLinkedinIn,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import InputWithIcon from "./InputWithIcon";
import {
  registerMyUser,
  verifyOTPData,
  userReset,
} from "../features/users/userSlice";

export default function Signup({ setIsSignIn }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userLoading, userError, userMessage, userSuccess } =
    useSelector((state) => state.auth);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOtpChange = (e) => setOtp(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!showOtpInput) {
      dispatch(registerMyUser(formData));
    } else {
      dispatch(verifyOTPData({ otp }));
    }
  };

  useEffect(() => {
    if (userSuccess && user && !showOtpInput) {
      setShowOtpInput(true);
      dispatch(userReset());
    } else if (userSuccess && user && showOtpInput) {
      toast.success(
        `Welcome, ${user.username}! Account verified successfully!`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      navigate("/");
      dispatch(userReset());
    }
  }, [userSuccess, user, showOtpInput, navigate, dispatch]);

  return (
    <div className="flex flex-col md:flex-row w-full font-montserrat">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 relative bg-gradient-to-b from-primary to-dark text-white flex flex-col justify-center items-center p-8 rounded-t-2xl md:rounded-tl-2xl md:rounded-bl-2xl">
        <Link
          to="/"
          className="absolute top-0 left-0 flex items-center z-10 gap-4 h-[8vh] w-[30%] md:h-[13vh] md:w-[30%] bg-white "
        >
          <img src="./logo.png" alt="Logo" className="object-contain" />
        </Link>
        <h2 className="text-2xl font-bold mb-3 mt-10">Welcome Back!</h2>
        <p className="text-center max-w-xs mb-4">
          Already have an account? Sign in to continue with Referra!
        </p>
        <button
          onClick={() => setIsSignIn(true)}
          className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-dark transition"
        >
          Sign In
        </button>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-6 md:p-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-4 text-center">
          {showOtpInput ? "Verify Your Email" : "Create An Account"}
        </h2>

        {userSuccess && !showOtpInput && (
          <p className="text-green-500 text-sm mb-4">OTP sent to your email!</p>
        )}
        {userSuccess && showOtpInput && (
          <p className="text-green-500 text-sm mb-4">
            Email verified successfully!
          </p>
        )}

        <div className="flex space-x-3 md:space-x-4 mb-6">
          {[FaFacebookF, FaGoogle, FaLinkedinIn].map((Icon, idx) => (
            <button
              key={idx}
              className="border rounded-full p-3 w-12 h-12 flex items-center justify-center hover:bg-light transition"
            >
              <Icon className="text-lg text-dark" />
            </button>
          ))}
        </div>

        <p className="mb-4 text-gray-500 text-sm text-center">
          {showOtpInput
            ? "Enter the OTP sent to your email"
            : "Or Signup Through Your Email"}
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-[24rem]">
          {!showOtpInput ? (
            <>
              <InputWithIcon
                type="text"
                name="username"
                placeholder="Name"
                Icon={FaUser}
                value={formData.username}
                onChange={handleChange}
              />
              <InputWithIcon
                type="email"
                name="email"
                placeholder="Email"
                Icon={FaEnvelope}
                value={formData.email}
                onChange={handleChange}
              />
              {userError && (
                <p className="text-red-500 text-sm mb-4">{userMessage}</p>
              )}
              <InputWithIcon
                type="password"
                name="password"
                placeholder="Password"
                Icon={FaLock}
                value={formData.password}
                onChange={handleChange}
              />
              <div className="flex items-center mb-4">
                <input type="checkbox" id="robot" className="mr-2 w-4 h-4" />
                <label htmlFor="robot" className="text-sm text-gray-700">
                  I am not a robot
                </label>
              </div>
            </>
          ) : (
            <InputWithIcon
              type="text"
              name="otp"
              placeholder="Enter OTP"
              Icon={FaLock}
              value={otp}
              onChange={handleOtpChange}
            />
          )}

          <button
            type="submit"
            disabled={userLoading}
            className={`w-full p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition ${
              userLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {userLoading
              ? showOtpInput
                ? "Verifying OTP..."
                : "Signing Up..."
              : showOtpInput
              ? "Verify OTP"
              : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
