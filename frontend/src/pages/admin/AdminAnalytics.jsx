import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#223252", "#cf8a24", "#56719d", "#a855f7", "#ef4444"];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/analytics").then((res) => setData(res.data));
  }, []);

  if (!data) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-card p-5">
        <h3 className="font-semibold mb-4 text-sm">Sales Trend (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.salesTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="_id" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#223252" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-card p-5">
          <h3 className="font-semibold mb-4 text-sm">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.ordersByStatus} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={90} label>
                {data.ordersByStatus.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-card p-5">
          <h3 className="font-semibold mb-4 text-sm">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" fontSize={12} />
              <YAxis type="category" dataKey="name" width={120} fontSize={11} />
              <Tooltip />
              <Bar dataKey="totalSold" fill="#cf8a24" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
