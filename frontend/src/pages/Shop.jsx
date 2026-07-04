import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";
import { SlidersHorizontal } from "lucide-react";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/products", {
          params: { keyword, category, sort, minPrice, maxPrice, page },
        });
        setProducts(data.products);
        setPages(data.pages);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [keyword, category, sort, minPrice, maxPrice, page]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display font-700 text-2xl">
          {keyword ? `Results for "${keyword}"` : "All Products"}
        </h1>
        <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-1 text-sm border rounded-full px-3 py-1.5">
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-56 flex-shrink-0 space-y-6`}>
          <div>
            <h3 className="font-semibold text-sm mb-2">Category</h3>
            <div className="space-y-1">
              <button onClick={() => updateParam("category", "")} className={`block text-sm ${!category ? "text-primary-700 font-semibold" : "text-gray-600"}`}>
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => updateParam("category", c._id)}
                  className={`block text-sm ${category === c._id ? "text-primary-700 font-semibold" : "text-gray-600"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2">Price Range (Rs.)</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                defaultValue={minPrice}
                onBlur={(e) => updateParam("minPrice", e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                defaultValue={maxPrice}
                onBlur={(e) => updateParam("maxPrice", e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2">Sort By</h3>
            <select value={sort} onChange={(e) => updateParam("sort", e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm">
              <option value="">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <p className="text-gray-500 py-10 text-center">No products found.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-full text-sm ${page === p ? "bg-primary-700 text-white" : "bg-white border text-gray-600"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
