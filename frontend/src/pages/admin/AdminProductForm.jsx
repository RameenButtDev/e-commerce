import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import toast from "react-hot-toast";
import { Upload, X } from "lucide-react";

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "", description: "", category: "", brand: "", price: "", discountPrice: "",
    countInStock: "", sku: "", isFeatured: false, images: [],
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
    if (isEdit) {
      api.get(`/products/${id}`).then((res) => {
        const p = res.data;
        setForm({
          name: p.name, description: p.description, category: p.category?._id || "",
          brand: p.brand, price: p.price, discountPrice: p.discountPrice,
          countInStock: p.countInStock, sku: p.sku || "", isFeatured: p.isFeatured, images: p.images || [],
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, images: [...f.images, data.url] }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), discountPrice: Number(form.discountPrice) || 0, countInStock: Number(form.countInStock) };
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="font-display font-700 text-xl mb-6">{isEdit ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={submit} className="bg-white rounded-xl shadow-card p-6 space-y-4">
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Product Name" className="w-full border rounded px-3 py-2 text-sm" />
        <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Description" rows={4} className="w-full border rounded px-3 py-2 text-sm" />

        <div className="grid grid-cols-2 gap-4">
          <select name="category" value={form.category} onChange={handleChange} required className="border rounded px-3 py-2 text-sm">
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="border rounded px-3 py-2 text-sm" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input name="price" type="number" value={form.price} onChange={handleChange} required placeholder="Price (Rs.)" className="border rounded px-3 py-2 text-sm" />
          <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} placeholder="Discount Price" className="border rounded px-3 py-2 text-sm" />
          <input name="countInStock" type="number" value={form.countInStock} onChange={handleChange} required placeholder="Stock Qty" className="border rounded px-3 py-2 text-sm" />
        </div>

        <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU (optional)" className="w-full border rounded px-3 py-2 text-sm" />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} /> Featured Product
        </label>

        <div>
          <label className="text-sm font-medium block mb-2">Product Images</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {form.images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                <img src={img} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-black/60 text-white p-0.5">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 text-sm border rounded-full px-4 py-2 cursor-pointer hover:bg-gray-50">
            <Upload size={14} /> {uploading ? "Uploading..." : "Upload Image"}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button disabled={saving} className="bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-full text-sm disabled:opacity-60">
            {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </button>
          <button type="button" onClick={() => navigate("/admin/products")} className="text-sm text-gray-500">Cancel</button>
        </div>
      </form>
    </div>
  );
}
