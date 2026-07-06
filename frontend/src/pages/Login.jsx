import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/";

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display font-700 text-2xl mb-2 text-center">Login to ShopEasy</h1>
      {redirect === "/checkout" && (
        <p className="text-sm text-center text-primary-700 bg-primary-50 rounded-lg py-2 px-3 mb-6">
          Please sign in to complete your order
        </p>
      )}
      {redirect !== "/checkout" && <div className="mb-6" />}
      <form onSubmit={submit} className="bg-white shadow-card rounded-xl p-6 space-y-4">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition" />
        <button disabled={loading} className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2.5 rounded-full transition disabled:opacity-60">
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-center text-gray-500">
          Don't have an account? <Link to={`/register${redirect !== "/" ? `?redirect=${redirect}` : ""}`} className="text-primary-700 font-medium hover:underline">Register</Link>
        </p>
        <p className="text-xs text-center text-gray-400 pt-2 border-t">
          Demo admin: admin@shop.com / admin123
        </p>
      </form>
    </div>
  );
}
