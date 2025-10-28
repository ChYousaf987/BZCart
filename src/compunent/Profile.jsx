import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/users/userSlice";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/loginprofile");
  };

  if (!user) {
    navigate("/loginprofile");
    return null;
  }

  return (
    <div className="min-h-screen bg-light flex flex-col items-center justify-center text-center p-6 font-cabin">
      {/* 🧑‍🎨 Profile Picture */}
      <div className="mb-6">
        <img
          src="https://yourlocalplumbing.com.au/wp-content/uploads/2024/01/dummy-image.png.webp" // 🎯 Dummy avatar image
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg"
        />
      </div>

      <h1 className="text-3xl font-bold text-dark mb-2">
        Welcome, {user.username || "User"} 👋
      </h1>
      <p className="text-gray-700 mb-6">{user.email}</p>

      <button
        onClick={handleLogout}
        className="bg-primary text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
      >
        Logout
      </button>
    </div>
  );
}
