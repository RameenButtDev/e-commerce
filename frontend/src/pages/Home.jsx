import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, c] = await Promise.all([
          api.get("/products/featured"),
          api.get("/categories"),
        ]);
        setFeatured(p.data);
        setCategories(c.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const perks = [
    { icon: Truck, label: "Fast Delivery Nationwide" },
    { icon: ShieldCheck, label: "Secure Payments" },
    { icon: RotateCcw, label: "Easy Returns" },
    { icon: Headphones, label: "24/7 Support" },
  ];

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="font-display font-800 text-3xl md:text-5xl leading-tight mb-4">
              Shop Smart. <br /> Pay with <span className="text-accent-400">JazzCash</span> or <span className="text-accent-400">EasyPaisa</span>.
            </h1>
            <p className="text-primary-100 mb-6 max-w-md">
              Thousands of products, unbeatable prices, delivered to your doorstep across Pakistan.
            </p>
            <Link to="/shop" className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-3 rounded-full transition">
              Start Shopping
            </Link>
          </div>
          <div className="flex-1 hidden md:block">
            <div className="w-full h-72 bg-white/10 rounded-2xl backdrop-blur flex items-center justify-center text-primary-100 text-sm">
              Featured Banner Area
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {perks.map((p, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-card">
            <p.icon className="text-primary-700" size={26} />
            <span className="text-sm font-medium text-ink">{p.label}</span>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="font-display font-700 text-xl mb-4">Shop by Category</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((c) => (
            <Link
              key={c._id}
              to={`/shop?category=${c._id}`}
              className="flex-shrink-0 w-32 text-center bg-white rounded-xl shadow-card p-4 hover:shadow-cardHover transition"
            >
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-bold text-lg">
                {c.name.charAt(0)}
              </div>
              <p className="text-xs font-medium">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-700 text-xl">Featured Products</h2>
          <Link to="/shop" className="text-sm text-primary-700 font-medium hover:underline">View all</Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
