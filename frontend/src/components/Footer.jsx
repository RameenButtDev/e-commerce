import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display font-700 text-xl text-white mb-3">
            Shop<span className="text-accent-500">Easy</span>
          </h3>
          <p className="text-sm text-gray-400">Pakistan's trusted online shopping destination for electronics, fashion, and more.</p>
          <div className="flex gap-3 mt-4">
            <Facebook size={18} className="hover:text-accent-500 cursor-pointer" />
            <Instagram size={18} className="hover:text-accent-500 cursor-pointer" />
            <Twitter size={18} className="hover:text-accent-500 cursor-pointer" />
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-accent-500">All Products</Link></li>
            <li><Link to="/shop?sort=price_asc" className="hover:text-accent-500">Best Deals</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/my-orders" className="hover:text-accent-500">My Orders</Link></li>
            <li><Link to="/login" className="hover:text-accent-500">Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Payments We Accept</h4>
          <p className="text-sm text-gray-400">Cash on Delivery, JazzCash, EasyPaisa</p>
        </div>
      </div>
      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ShopEasy. All rights reserved.
      </div>
    </footer>
  );
}
