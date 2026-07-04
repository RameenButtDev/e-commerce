import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";
import { Truck, ShieldCheck, RotateCcw, Headphones, ArrowRight, Star } from "lucide-react";

const categoryImages = {
  Electronics: "https://picsum.photos/seed/cat-electronics/300/300",
  Fashion: "https://picsum.photos/seed/cat-fashion/300/300",
  "Home & Living": "https://picsum.photos/seed/cat-home/300/300",
  Beauty: "https://picsum.photos/seed/cat-beauty/300/300",
};

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
    { icon: Truck, label: "Free Delivery", sub: "On orders over Rs. 5,000" },
    { icon: ShieldCheck, label: "Secure Payments", sub: "JazzCash, EasyPaisa, COD" },
    { icon: RotateCcw, label: "Easy Returns", sub: "7-day return policy" },
    { icon: Headphones, label: "24/7 Support", sub: "Dedicated help center" },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink">
        <img
          src="https://picsum.photos/seed/hero-shopping/1600/700"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <p className="inline-block bg-accent-500 text-ink text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wide">
            RAMADAN SALE — UP TO 40% OFF
          </p>
          <h1 className="font-display font-800 text-3xl md:text-5xl leading-tight mb-4 text-white max-w-xl">
            Everything You Need, <span className="text-accent-400">Delivered Fast</span>
          </h1>
          <p className="text-gray-300 mb-8 max-w-md">
            Shop electronics, fashion, home essentials & beauty — pay easily with JazzCash, EasyPaisa, or Cash on Delivery.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-ink font-semibold px-6 py-3 rounded-full transition">
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link to="/shop?sort=price_asc" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition">
              Best Deals
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 mt-12">
            {[["10,000+", "Products"], ["50,000+", "Happy Customers"], ["4.7", "Avg. Rating"]].map(([num, label]) => (
              <div key={label}>
                <p className="text-2xl font-display font-800 text-white">{num}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-cardHover grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {perks.map((p, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 md:p-5">
              <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
                <p.icon size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{p.label}</p>
                <p className="text-xs text-gray-400 truncate hidden md:block">{p.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-700 text-xl md:text-2xl">Shop by Category</h2>
          <Link to="/shop" className="text-sm text-primary-700 font-medium hover:underline flex items-center gap-1">
            Browse all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link
              key={c._id}
              to={`/shop?category=${c._id}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-card hover:shadow-cardHover transition-all"
            >
              <img
                src={categoryImages[c.name] || `https://picsum.photos/seed/${c.slug}/300/300`}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <p className="absolute bottom-3 left-4 text-white font-display font-600 text-sm md:text-base">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-700 text-xl md:text-2xl">Featured Products</h2>
            <p className="text-sm text-gray-400 mt-1">Hand-picked deals just for you</p>
          </div>
          <Link to="/shop" className="text-sm text-primary-700 font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-primary-50 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display font-700 text-xl md:text-2xl text-center mb-8">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Ayesha K.", city: "Lahore", text: "Fast delivery and the JazzCash checkout was super smooth. Will shop again!" },
              { name: "Bilal A.", city: "Karachi", text: "Great prices and genuine products. Customer support responded quickly." },
              { name: "Sana M.", city: "Islamabad", text: "Loved the easy returns process. Ordering here feels safe and reliable." },
            ].map((r, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-card p-5">
                <div className="flex text-accent-500 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-accent-500" />)}
                </div>
                <p className="text-sm text-gray-600 mb-4">"{r.text}"</p>
                <p className="text-sm font-semibold">{r.name} <span className="text-gray-400 font-normal">· {r.city}</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
