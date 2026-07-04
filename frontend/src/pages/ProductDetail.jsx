import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Star, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const { addToCart } = useCart();
  const { userInfo } = useAuth();

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setActiveImg(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${product._id}/reviews`, { rating: reviewRating, comment: reviewComment });
      toast.success("Review submitted");
      setReviewComment("");
      loadProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  if (loading) return <Loader />;
  if (!product) return <p className="text-center py-20">Product not found.</p>;

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
            {product.images?.[activeImg] ? (
              <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImg(idx)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${activeImg === idx ? "border-primary-700" : "border-transparent"}`}>
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display font-700 text-2xl mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Star size={14} className="text-accent-500 fill-accent-500" />
            {product.rating?.toFixed(1)} ({product.numReviews} reviews) · {product.brand}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-primary-700">Rs. {(hasDiscount ? product.discountPrice : product.price).toLocaleString()}</span>
            {hasDiscount && <span className="text-gray-400 line-through">Rs. {product.price.toLocaleString()}</span>}
          </div>

          <p className="text-gray-600 text-sm mb-6 leading-relaxed">{product.description}</p>

          <p className="text-sm mb-4">
            {product.countInStock > 0 ? (
              <span className="text-green-600 font-medium">In Stock ({product.countInStock} available)</span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </p>

          {product.countInStock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-full">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2"><Minus size={16} /></button>
                <span className="px-3 text-sm font-medium">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.countInStock, q + 1))} className="p-2"><Plus size={16} /></button>
              </div>
              <button
                onClick={() => {
                  addToCart(product, qty);
                  toast.success("Added to cart");
                }}
                className="flex-1 bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 rounded-full transition"
              >
                Add to Cart
              </button>
            </div>
          )}

          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold mb-4">Customer Reviews</h3>
            {product.reviews?.length === 0 && <p className="text-sm text-gray-500 mb-4">No reviews yet.</p>}
            <div className="space-y-4 mb-6">
              {product.reviews?.map((r, idx) => (
                <div key={idx} className="border-b pb-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {r.name} <span className="flex text-accent-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{r.comment}</p>
                </div>
              ))}
            </div>

            {userInfo ? (
              <form onSubmit={submitReview} className="space-y-3">
                <select value={reviewRating} onChange={(e) => setReviewRating(e.target.value)} className="border rounded px-3 py-2 text-sm">
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 && "s"}</option>)}
                </select>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Write your review..."
                  required
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={3}
                />
                <button className="bg-primary-700 text-white text-sm font-semibold px-5 py-2 rounded-full">Submit Review</button>
              </form>
            ) : (
              <p className="text-sm text-gray-500">Please login to write a review.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
