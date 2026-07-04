import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/analytics").then((res) => setData(res.data));
  }, []);

  if (!data) return <Loader />;

  const cards = [
    { label: "Total Revenue", value: `Rs. ${data.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-green-100 text-green-700" },
    { label: "Total Orders", value: data.totalOrders, icon: ShoppingBag, color: "bg-blue-100 text-blue-700" },
    { label: "Total Products", value: data.totalProducts, icon: Package, color: "bg-purple-100 text-purple-700" },
    { label: "Total Customers", value: data.totalUsers, icon: Users, color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-card p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${c.color}`}>
              <c.icon size={20} />
            </div>
            <p className="text-xl font-bold">{c.value}</p>
            <p className="text-xs text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-card p-5">
          <h3 className="font-semibold mb-4 text-sm">Orders by Status</h3>
          <div className="space-y-2">
            {data.ordersByStatus.map((s) => (
              <div key={s._id} className="flex justify-between text-sm">
                <span>{s._id}</span>
                <span className="font-medium">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-5">
          <h3 className="font-semibold mb-4 text-sm flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500" /> Low Stock Alert
          </h3>
          {data.lowStock.length === 0 ? (
            <p className="text-sm text-gray-400">All products well stocked.</p>
          ) : (
            <div className="space-y-2">
              {data.lowStock.map((p) => (
                <div key={p._id} className="flex justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="text-red-600 font-medium">{p.countInStock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-card p-5 md:col-span-2">
          <h3 className="font-semibold mb-4 text-sm">Top Selling Products</h3>
          <div className="space-y-2">
            {data.topProducts.map((p, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{p.name}</span>
                <span className="font-medium">{p.totalSold} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
