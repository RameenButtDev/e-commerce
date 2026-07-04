import React, { createContext, useState, useContext } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUserInfo(data);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post("/auth/register", { name, email, password, phone });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUserInfo(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    toast.success("Logged out");
  };

  const updateUserInfo = (data) => {
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUserInfo(data);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, register, logout, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
