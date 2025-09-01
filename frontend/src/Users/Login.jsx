import React, { useEffect, useState } from "react";
import { loginAction } from "../redux/slices/users/userSlices";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "../components/Alert/LoadingComponent";
import ErrorMsg from "../components/Alert/ErrorMsg";
import SuccessMsg from "../components/Alert/SuccessMsg";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    password: "",
    username: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form handler
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      loginAction({
        username: formData.username,
        password: formData.password,
      })
    );
    // Optional: Do not reset form immediately to avoid interrupting user during loading
  };

  const { userAuth, loading, error, success } = useSelector((state) => state.users);

  // Redirect on successful login
  useEffect(() => {
    if (userAuth?.userInfo?.token) {
      navigate(`/users/public-profile/${userAuth?.userInfo?._id || ""}`);
    }
  }, [userAuth?.userInfo, navigate]);

  return (
    <section className="py-16 xl:pb-56 bg-white overflow-hidden min-h-screen flex items-center">
      <div className="container px-4 mx-auto max-w-md">
        <div className="text-center mb-16">
          {/* <img
            className="mx-auto mb-12 max-h-16"
            src="flaro-assets/logos/flaro-logo-black-xl.svg"
            alt="App Logo"
          /> */}
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-coolGray-900 mb-4">
            Login to your account
          </h2>
          <p className="text-lg font-medium text-gray-600 mb-12">
            Enter your details below.
          </p>
        </div>

        {/* Display Error */}
        {error && <ErrorMsg message={error.message} />}
        {/* Display Success */}
        {success && <SuccessMsg message="Login Successful!" />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <input
              className="px-4 py-3.5 w-full text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 font-medium"
              type="text"
              placeholder="Enter Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
              aria-label="Username"
            />
          </label>
          <label className="block">
            <input
              className="px-4 py-3.5 w-full text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 font-medium"
              type="password"
              placeholder="Enter Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              aria-label="Password"
            />
          </label>

          {loading ? (
            <LoadingComponent />
          ) : (
            <button
              type="submit"
              className="w-full py-4 text-white bg-indigo-600 rounded-xl shadow-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition"
            >
              Login Account
            </button>
          )}
        </form>

        <p className="mt-6 text-center text-gray-600 font-medium text-sm">
          Forgot Password?{" "}
          <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-700">
            Reset Password
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
