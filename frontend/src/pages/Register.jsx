import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/";

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success("Account created!");
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition";

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display font-700 text-2xl mb-2 text-center">Create Your Account</h1>
      {redirect === "/checkout" ? (
        <p className="text-sm text-center text-primary-700 bg-primary-50 rounded-lg py-2 px-3 mb-6">
          Create an account to complete your order
        </p>
      ) : (
        <div className="mb-6" />
      )}
      <form onSubmit={submit} className="bg-white shadow-card rounded-xl p-6 space-y-4">
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name" className={inputClass} />
        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className={inputClass} />
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number" className={inputClass} />
        <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password (min 6 chars)" className={inputClass} />
        <button disabled={loading} className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2.5 rounded-full transition disabled:opacity-60">
          {loading ? "Creating..." : "Register"}
        </button>
        <p className="text-sm text-center text-gray-500">
          Already have an account? <Link to={`/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`} className="text-primary-700 font-medium hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
