import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import toast from "react-hot-toast";
import { Trash2, Plus } from "lucide-react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: "", discountType: "percentage", discountValue: "", minOrderAmount: "", maxUses: "", expiresAt: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/coupons");
      setCoupons(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/coupons", {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        maxUses: Number(form.maxUses) || 0,
        expiresAt: form.expiresAt || undefined,
      });
      toast.success("Coupon created");
      setForm({ code: "", discountType: "percentage", discountValue: "", minOrderAmount: "", maxUses: "", expiresAt: "" });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    await api.delete(`/coupons/${id}`);
    toast.success("Coupon deleted");
    load();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="font-display font-700 text-xl mb-6">Coupons & Discounts</h2>

      <form onSubmit={submit} className="bg-white rounded-xl shadow-card p-5 grid md:grid-cols-3 gap-4 mb-6">
        <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="CODE (e.g. SALE20)" className="border rounded px-3 py-2 text-sm" />
        <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="border rounded px-3 py-2 text-sm">
          <option value="percentage">Percentage (%)</option>
          <option value="fixed">Fixed Amount (Rs.)</option>
        </select>
        <input required type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} placeholder="Discount Value" className="border rounded px-3 py-2 text-sm" />
        <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} placeholder="Min Order Amount" className="border rounded px-3 py-2 text-sm" />
        <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="Max Uses (0=unlimited)" className="border rounded px-3 py-2 text-sm" />
        <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="border rounded px-3 py-2 text-sm" />
        <button disabled={saving} className="flex items-center justify-center gap-1 bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded md:col-span-3">
          <Plus size={14} /> Create Coupon
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Min Order</th>
              <th className="px-4 py-3">Used</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
                <td className="px-4 py-3">{c.discountType === "percentage" ? `${c.discountValue}%` : `Rs. ${c.discountValue}`}</td>
                <td className="px-4 py-3">Rs. {c.minOrderAmount}</td>
                <td className="px-4 py-3">{c.usedCount}{c.maxUses > 0 ? ` / ${c.maxUses}` : ""}</td>
                <td className="px-4 py-3">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "Never"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => deleteCoupon(c._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
