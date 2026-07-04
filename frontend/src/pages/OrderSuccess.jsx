import React, { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import { CheckCircle2, XCircle } from "lucide-react";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  const paid = params.get("paid");

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;

  const paymentFailed = paid === "false";

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      {paymentFailed ? (
        <XCircle size={64} className="text-red-500 mx-auto mb-4" />
      ) : (
        <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
      )}
      <h1 className="font-display font-700 text-2xl mb-2">
        {paymentFailed ? "Payment Failed" : "Order Placed Successfully!"}
      </h1>
      <p className="text-gray-500 mb-6">
        {paymentFailed
          ? "Your payment could not be processed. You can retry payment from My Orders."
          : "Thank you for shopping with us. Your order is being processed."}
      </p>
      {order && (
        <div className="bg-white shadow-card rounded-xl p-5 text-left mb-6">
          <p className="text-sm"><span className="font-medium">Order ID:</span> {order._id}</p>
          <p className="text-sm"><span className="font-medium">Total:</span> Rs. {order.totalPrice.toLocaleString()}</p>
          <p className="text-sm"><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
          <p className="text-sm"><span className="font-medium">Status:</span> {order.status}</p>
        </div>
      )}
      <div className="flex gap-3 justify-center">
        <Link to="/my-orders" className="bg-primary-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold">View My Orders</Link>
        <Link to="/shop" className="border border-primary-700 text-primary-700 px-5 py-2.5 rounded-full text-sm font-semibold">Continue Shopping</Link>
      </div>
    </div>
  );
}
