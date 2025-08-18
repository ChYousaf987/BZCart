import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginMyUser, userReset } from "../features/users/userSlice";
import logos from "../assets/logos.png";
const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userLoading, userError, userMessage, userSuccess, user } =
    useSelector((state) => state.auth);

  const { email, password } = formFields;

  const handleChange = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await dispatch(loginMyUser({ email, password }));
  };

  useEffect(() => {
    if (userError) {
      toast.error(userMessage);
      dispatch(userReset());
    }
    if (userSuccess && user && user.isApproved) {
      toast.success("Login successful!");
      dispatch(userReset());
      navigate("/home");
    }
  }, [userError, userMessage, userSuccess, user, dispatch, navigate]);

  return (
    <div className="bg-[#EFF6FF] h-screen flex justify-center items-center">
      <div className="flex flex-col md:flex-row w-[90%] max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px]">
        {/* Left Image */}
        <div className="md:w-1/2 w-full h-64 md:h-auto relative">
          <div className="absolute right-1 top-1 z-20">
            <img src={logos} alt="logos" className="w-[150px]" />
          </div>
          <img
            src="https://media.istockphoto.com/id/656814364/photo/young-person-vaping-an-e-cig-with-lots-of-clouds-isolated-on-a-dark-background.jpg?s=612x612&w=0&k=20&c=EdUsNTeF9pL2rUWF8zV6yTLRNigw0ty9dGPC_xvReCQ="
            alt="Vape"
            className="w-full h-full object-cover "
          />
        </div>

        {/* Right Login Form */}
        <div className="md:w-1/2 w-full p-10 flex flex-col justify-center gap-5">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            LOGIN
          </h2>
          <form className="space-y-5" onSubmit={handleLogin}>
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
            <button
              type="submit"
              disabled={userLoading}
              className="bg-blue-600 text-white py-2 w-full rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {userLoading ? "Logging in..." : "Login"}
            </button>
            <Link to="/signup">
              <button
                type="button"
                className="border border-blue-600 mt-3 text-blue-600 py-2 w-full rounded-lg hover:bg-blue-50 transition"
              >
                Register
              </button>
            </Link>
            <p className="text-sm text-gray-500 hover:underline cursor-pointer text-center">
              Forgot your password?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
