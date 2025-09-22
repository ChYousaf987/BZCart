import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";
import InputWithIcon from "./InputWithIcon";
import { loginMyUser, userReset } from "../features/users/userSlice";

export default function Login({ setIsSignIn }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userLoading, userError, userMessage, userSuccess } =
    useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginMyUser(formData));
  };

  useEffect(() => {
    if (userSuccess && user) {
      toast.success(`Welcome back, ${user.username}!`, {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
      dispatch(userReset());
    }
  }, [userSuccess, user, navigate, dispatch]);

  return (
    <div className="flex flex-col md:flex-row  font-cabin">
      {/* Left Panel - Form */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8 md:p-12 shadow-lg">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-800">
          Sign in to <span className="text-primary">BZCart</span>
        </h2>

        {userError && (
          <p className="text-red-500 text-sm mb-4 text-center">{userMessage}</p>
        )}
        {userSuccess && (
          <p className="text-green-500 text-sm mb-4 text-center">
            Login successful!
          </p>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <InputWithIcon
            type="email"
            name="email"
            placeholder="Email"
            Icon={FaEnvelope}
            value={formData.email}
            onChange={handleChange}
          />
          <InputWithIcon
            type="password"
            name="password"
            placeholder="Password"
            Icon={FaLock}
            value={formData.password}
            onChange={handleChange}
          />

          <div className="flex items-center mb-6 mt-2">
            <input type="checkbox" id="remember" className="mr-2 w-4 h-4" />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={userLoading}
            className={`w-full py-3 bg-primary text-white font-semibold rounded-xl shadow-lg hover:from-primary/90 hover:to-secondary/90 transition-all ${
              userLoading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {userLoading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account?{" "}
          <button
            onClick={() => setIsSignIn(false)}
            className="text-primary font-medium hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>

      {/* Right Panel */}
      <div
        className="w-full md:w-1/2 relative text-white flex flex-col justify-between items-center p-10 bg-cover bg-center rounded-tl-3xl md:rounded-tr-none md:rounded-br-3xl"
        style={{ backgroundImage: "url('./logo.png')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-dark/90  md:rounded-tr-none md:rounded-br-3xl" />

        {/* Center Text */}
        <div className="z-10 flex-1 flex flex-col justify-center items-center text-center my-12 md:my-0">
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="max-w-xs">
            Enter your credentials to access your account and enjoy shopping
            with BZCart.
          </p>
        </div>

        {/* Buttons */}
        <div className="z-10 flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => setIsSignIn(false)}
            className="w-full py-3 border border-white rounded-xl hover:bg-white hover:text-primary transition font-semibold"
          >
            Sign Up
          </button>
          <Link
            to="/"
            className="w-full py-3 border border-white rounded-xl hover:bg-white hover:text-primary transition font-semibold text-center"
          >
            Back To Home
          </Link>
        </div>
      </div>
    </div>
  );
}
