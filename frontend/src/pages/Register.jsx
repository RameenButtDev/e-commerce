import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display font-700 text-2xl mb-6 text-center">Create Your Account</h1>
      <form onSubmit={submit} className="bg-white shadow-card rounded-xl p-6 space-y-4">
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name" className="w-full border rounded px-3 py-2 text-sm" />
        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full border rounded px-3 py-2 text-sm" />
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number" className="w-full border rounded px-3 py-2 text-sm" />
        <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password (min 6 chars)" className="w-full border rounded px-3 py-2 text-sm" />
        <button disabled={loading} className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2.5 rounded-full transition disabled:opacity-60">
          {loading ? "Creating..." : "Register"}
        </button>
        <p className="text-sm text-center text-gray-500">
          Already have an account? <Link to="/login" className="text-primary-700 font-medium hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
