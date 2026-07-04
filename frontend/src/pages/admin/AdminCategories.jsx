import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import { Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await api.post("/categories", { name });
      setName("");
      toast.success("Category added");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      load();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-xl">
      <h2 className="font-display font-700 text-xl mb-6">Categories</h2>
      <form onSubmit={addCategory} className="flex gap-2 mb-6">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" className="flex-1 border rounded px-3 py-2 text-sm" />
        <button disabled={saving} className="flex items-center gap-1 bg-primary-700 text-white text-sm font-semibold px-4 rounded">
          <Plus size={14} /> Add
        </button>
      </form>
      <div className="bg-white rounded-xl shadow-card divide-y">
        {categories.map((c) => (
          <div key={c._id} className="flex justify-between items-center px-4 py-3">
            <span className="text-sm font-medium">{c.name}</span>
            <button onClick={() => deleteCategory(c._id)} className="text-red-600 hover:text-red-800">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
