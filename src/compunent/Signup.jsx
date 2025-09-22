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
  const { user, tempUser, userLoading, userError, userMessage, userSuccess } =
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
    if (userError) {
      toast.error(userMessage, { position: "top-right", autoClose: 3000 });
      dispatch(userReset());
    }
    if (userSuccess && tempUser && !showOtpInput) {
      toast.success("OTP sent to your email!", {
        position: "top-right",
        autoClose: 3000,
      });
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
  }, [
    userSuccess,
    userError,
    userMessage,
    user,
    tempUser,
    showOtpInput,
    navigate,
    dispatch,
  ]);

  return (
    <div className="flex flex-col md:flex-row font-cabin">
      {/* Left Panel */}
      <div
        className="w-full md:w-1/2 relative text-white flex flex-col justify-center items-center p-10 rounded-t-3xl md:rounded-tl-3xl md:rounded-bl-3xl bg-cover bg-center shadow-lg"
        style={{ backgroundImage: "url('./logo.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-dark/90 rounded-t-3xl md:rounded-tl-3xl md:rounded-bl-3xl" />
        <h2 className="text-3xl font-bold mb-4 z-10 mt-12">Welcome Back!</h2>
        <p className="text-center max-w-xs mb-6 z-10">
          Already have an account? Sign in to continue with Referra!
        </p>
        <button
          onClick={() => setIsSignIn(true)}
          className="z-10 w-40 py-3 border border-white rounded-xl hover:bg-white hover:text-primary font-semibold transition"
        >
          Log In
        </button>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8 md:p-12 shadow-lg">
        <h2 className="text-3xl sm:text-3xl font-bold text-primary mb-6 text-center">
          {showOtpInput ? "Verify Your Email" : "Create An Account"}
        </h2>

        {userSuccess && !showOtpInput && (
          <p className="text-green-500 text-sm mb-4 text-center">
            OTP sent to your email!
          </p>
        )}
        {userSuccess && showOtpInput && (
          <p className="text-green-500 text-sm mb-4 text-center">
            Enter the OTP to complete registration
          </p>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-sm">
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
                <label htmlFor="robot" className="text-sm text-gray-600">
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
            className={`w-full py-3 bg-primary text-white font-semibold rounded-xl shadow-lg hover:from-primary/90 hover:to-secondary/90 transition ${
              userLoading ? "opacity-60 cursor-not-allowed" : ""
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
