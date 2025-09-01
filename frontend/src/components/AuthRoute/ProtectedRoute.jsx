import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check if user is logged in
  const { userAuth } = useSelector((state) => state?.users);
  const isLogin = userAuth?.userInfo?.token;

  if (!isLogin) {
    return <Navigate to="/login" />;
  }

  // Render nested routes
  return <Outlet />;
};

export default ProtectedRoute;
