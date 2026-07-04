import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Trash2, Minus, Plus } from "lucide-react";

export default function Cart() {
  const { cartItems, updateQty, removeFromCart, itemsPrice } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!userInfo) return navigate("/login?redirect=/checkout");
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display font-700 text-xl mb-3">Your cart is empty</h2>
        <Link to="/shop" className="text-primary-700 font-medium hover:underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display font-700 text-2xl mb-6">Shopping Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.product} className="flex gap-4 bg-white rounded-xl shadow-card p-4">
              <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : null}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">{item.name}</h3>
                <p className="text-primary-700 font-semibold mt-1">Rs. {item.price.toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border rounded-full">
                    <button onClick={() => updateQty(item.product, Math.max(1, item.qty - 1))} className="p-1.5"><Minus size={14} /></button>
                    <span className="px-3 text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.product, Math.min(item.countInStock, item.qty + 1))} className="p-1.5"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.product)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right font-semibold text-sm">Rs. {(item.price * item.qty).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-card p-5 h-fit">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>Rs. {itemsPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-2 text-gray-500">
            <span>Shipping</span>
            <span>{itemsPrice > 5000 ? "Free" : "Rs. 200"}</span>
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>Rs. {(itemsPrice + (itemsPrice > 5000 ? 0 : 200)).toLocaleString()}</span>
          </div>
          <button onClick={handleCheckout} className="w-full mt-5 bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 rounded-full transition">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
