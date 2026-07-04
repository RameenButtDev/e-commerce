import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const totalQty = cartItems.reduce((acc, i) => acc + i.qty, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/shop?keyword=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-card">
      <div className="hidden md:block bg-ink text-gray-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between">
          <span>Free delivery on orders over Rs. 5,000</span>
          <span>Pay easily with JazzCash · EasyPaisa · COD</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="font-display font-800 text-2xl text-primary-700 flex-shrink-0">
            Shop<span className="text-accent-500">Easy</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands..."
              className="w-full border border-gray-200 rounded-l-full px-4 py-2 text-sm focus:outline-none focus:border-primary-500"
            />
            <button className="bg-primary-700 text-white px-5 rounded-r-full hover:bg-primary-800 transition">
              <Search size={18} />
            </button>
          </form>

          <div className="hidden md:flex items-center gap-5">
            <Link to="/cart" className="relative flex flex-col items-center text-ink hover:text-primary-700">
              <ShoppingCart size={22} />
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-3 bg-accent-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1 text-ink hover:text-primary-700"
                >
                  <User size={22} />
                  <span className="text-sm font-medium">{userInfo.name.split(" ")[0]}</span>
                </button>
                {profileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-cardHover border border-gray-100 py-2"
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <Link to="/my-orders" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                      My Orders
                    </Link>
                    {userInfo.role === "admin" && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                        <LayoutDashboard size={15} /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                        navigate("/");
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-sm font-semibold bg-primary-700 text-white px-4 py-2 rounded-full hover:bg-primary-800">
                Login
              </Link>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full border border-gray-200 rounded-l-full px-4 py-2 text-sm"
              />
              <button className="bg-primary-700 text-white px-4 rounded-r-full"><Search size={16} /></button>
            </form>
            <Link to="/cart" className="block py-1" onClick={() => setMenuOpen(false)}>Cart ({totalQty})</Link>
            {userInfo ? (
              <>
                <Link to="/my-orders" className="block py-1" onClick={() => setMenuOpen(false)}>My Orders</Link>
                {userInfo.role === "admin" && (
                  <Link to="/admin" className="block py-1" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                )}
                <button onClick={() => { logout(); setMenuOpen(false); navigate("/"); }} className="block py-1 text-red-600">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block py-1 font-semibold text-primary-700" onClick={() => setMenuOpen(false)}>Login</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
