import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function PrivateRoute() {
  const { userInfo } = useAuth();
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
}
