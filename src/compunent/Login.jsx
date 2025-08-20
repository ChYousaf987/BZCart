import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaFacebookF,
  FaGoogle,
  FaLinkedinIn,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
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
    <div className="flex flex-col md:flex-row w-full font-montserrat">
      {/* Left Panel - Form */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-6 md:p-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-4 text-center">
          Sign in to BZ Cart
        </h2>

        {userError && (
          <p className="text-red-500 text-sm mb-4">{userMessage}</p>
        )}
        {userSuccess && (
          <p className="text-green-500 text-sm mb-4">Login successful!</p>
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
          Or Sign in Through Your Email
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-[24rem]">
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
          <div className="w-full text-right mb-4">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <div className="flex items-center mb-4">
            <input type="checkbox" id="remember" className="mr-2 w-4 h-4" />
            <label htmlFor="remember" className="text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={userLoading}
            className={`w-full p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition ${
              userLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {userLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* Right Panel */}
      <div className="w-full relative md:w-1/2 bg-gradient-to-b from-primary to-dark text-white flex flex-col justify-center items-center p-8 rounded-b-2xl md:rounded-tr-2xl md:rounded-br-2xl">
        <Link
          to="/"
          className="absolute top-0 right-0 flex items-center z-10 gap-4 h-[8vh] w-[30%] md:h-[13vh] md:w-[30%] bg-white "
        >
          <img src="./logo.png" alt="Logo" className="object-contain" />
        </Link>
        <h2 className="text-2xl font-bold mb-3 mt-10">Hi User!</h2>
        <p className="text-center max-w-xs mb-4">
          Don't have an account? Sign up to join Referra!
        </p>
        <button
          onClick={() => setIsSignIn(false)}
          className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-dark transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
