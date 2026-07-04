import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/myorders").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display font-700 text-2xl mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o._id} to={`/order/${o._id}`} className="block bg-white shadow-card rounded-xl p-4 hover:shadow-cardHover transition">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="text-sm font-medium">Order #{o._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()} · {o.orderItems.length} item(s)</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[o.status]}`}>{o.status}</span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">{o.paymentMethod} {o.isPaid ? "· Paid" : "· Unpaid"}</span>
                <span className="font-semibold text-primary-700">Rs. {o.totalPrice.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
