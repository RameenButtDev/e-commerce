import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

  const handleAdd = (e) => {
    e.preventDefault();
    if (product.countInStock < 1) return toast.error("Out of stock");
    addToCart(product, 1);
    toast.success("Added to cart");
  };

  return (
    <Link
      to={`/product/${product.slug || product._id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-cardHover hover:-translate-y-0.5 transition-all duration-200 flex flex-col border border-gray-50"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No Image</div>
        )}
        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 bg-accent-500 text-ink text-[11px] font-bold px-2 py-1 rounded-md shadow-sm">
            -{Math.round(100 - (product.discountPrice / product.price) * 100)}%
          </span>
        )}
        {product.countInStock < 1 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-sm">
            Out of Stock
          </div>
        )}
        <button
          onClick={handleAdd}
          className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-primary-700 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 hover:bg-primary-700 hover:text-white"
          aria-label="Add to cart"
        >
          <ShoppingCart size={15} />
        </button>
      </div>
      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">{product.brand || "ShopEasy"}</p>
        <h3 className="text-sm font-medium text-ink line-clamp-2 min-h-[2.5rem] leading-snug">{product.name}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star size={12} className="text-accent-500 fill-accent-500" />
          <span className="font-medium text-ink">{product.rating?.toFixed(1) || "0.0"}</span>
          <span>({product.numReviews || 0})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-bold text-primary-700">Rs. {(hasDiscount ? product.discountPrice : product.price).toLocaleString()}</span>
          {hasDiscount && <span className="text-xs text-gray-400 line-through">Rs. {product.price.toLocaleString()}</span>}
        </div>
      </div>
    </Link>
  );
}
