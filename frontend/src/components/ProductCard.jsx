import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
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
      className="group bg-white rounded-xl overflow-hidden shadow-card hover:shadow-cardHover transition-all duration-200 flex flex-col"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No Image</div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded">
            {Math.round(100 - (product.discountPrice / product.price) * 100)}% OFF
          </span>
        )}
        {product.countInStock < 1 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-sm">
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="text-sm font-medium text-ink line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star size={12} className="text-accent-500 fill-accent-500" />
          {product.rating?.toFixed(1) || "0.0"} ({product.numReviews || 0})
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="price-tag">Rs. {(hasDiscount ? product.discountPrice : product.price).toLocaleString()}</span>
          {hasDiscount && <span className="text-xs text-gray-400 line-through">Rs. {product.price.toLocaleString()}</span>}
        </div>
        <button
          onClick={handleAdd}
          className="mt-2 text-xs font-semibold border border-primary-700 text-primary-700 rounded-full py-1.5 hover:bg-primary-700 hover:text-white transition"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
