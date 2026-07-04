import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute() {
  const { userInfo } = useAuth();
  if (!userInfo) return <Navigate to="/login" replace />;
  if (userInfo.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
