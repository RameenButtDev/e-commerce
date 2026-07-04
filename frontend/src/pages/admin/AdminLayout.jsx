import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ListOrdered, Users, Tag, BarChart3, FolderTree, LogOut, Store } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/orders", label: "Orders", icon: ListOrdered },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/coupons", label: "Coupons", icon: Tag },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminLayout() {
  const location = useLocation();
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-ink text-gray-300 flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <h1 className="font-display font-700 text-lg text-white">ShopEasy <span className="text-accent-500">Admin</span></h1>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          {navItems.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm ${active ? "bg-primary-700 text-white" : "hover:bg-gray-800"}`}
              >
                <item.icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700 space-y-2">
          <Link to="/" className="flex items-center gap-2 text-xs hover:text-white"><Store size={14} /> View Store</Link>
          <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-card px-6 py-4 flex justify-between items-center">
          <h2 className="font-display font-600 text-lg">Welcome, {userInfo?.name}</h2>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
