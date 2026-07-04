import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p className="text-center py-20">Order not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display font-700 text-2xl mb-6">Order #{order._id.slice(-8).toUpperCase()}</h1>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-card rounded-xl p-5">
          <h3 className="font-semibold mb-2 text-sm">Shipping Address</h3>
          <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress.province} {order.shippingAddress.postalCode}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
        </div>
        <div className="bg-white shadow-card rounded-xl p-5">
          <h3 className="font-semibold mb-2 text-sm">Payment</h3>
          <p className="text-sm text-gray-600">Method: {order.paymentMethod}</p>
          <p className="text-sm text-gray-600">Status: {order.isPaid ? "Paid" : "Unpaid"}</p>
          <p className="text-sm text-gray-600 font-medium mt-2">Order Status: {order.status}</p>
        </div>
      </div>
      <div className="bg-white shadow-card rounded-xl p-5">
        <h3 className="font-semibold mb-4 text-sm">Items</h3>
        <div className="space-y-3">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>{item.name} × {item.qty}</span>
              <span>Rs. {(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>Rs. {order.itemsPrice.toLocaleString()}</span></div>
          {order.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-Rs. {order.discountAmount.toLocaleString()}</span></div>}
          <div className="flex justify-between"><span>Shipping</span><span>Rs. {order.shippingPrice.toLocaleString()}</span></div>
          <div className="flex justify-between font-semibold text-base border-t pt-2"><span>Total</span><span>Rs. {order.totalPrice.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}
