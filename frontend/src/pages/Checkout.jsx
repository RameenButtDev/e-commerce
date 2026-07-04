import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import toast from "react-hot-toast";

export default function Checkout() {
  const { cartItems, itemsPrice, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    fullName: userInfo?.name || "",
    phone: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applying, setApplying] = useState(false);
  const [placing, setPlacing] = useState(false);

  const shippingPrice = itemsPrice > 5000 ? 0 : 200;
  const totalPrice = Math.max(itemsPrice - discount + shippingPrice, 0);

  const handleChange = (e) => setShipping({ ...shipping, [e.target.name]: e.target.value });

  const applyCoupon = async () => {
    if (!couponCode) return;
    setApplying(true);
    try {
      const { data } = await api.post("/coupons/validate", { code: couponCode, orderAmount: itemsPrice });
      setDiscount(data.discountAmount);
      toast.success(`Coupon applied! Rs. ${data.discountAmount} off`);
    } catch (err) {
      setDiscount(0);
      toast.error(err.response?.data?.message || "Invalid coupon");
    } finally {
      setApplying(false);
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const orderItems = cartItems.map((i) => ({ product: i.product, name: i.name, qty: i.qty }));
      const { data: order } = await api.post("/orders", {
        orderItems,
        shippingAddress: shipping,
        paymentMethod,
        couponCode: discount > 0 ? couponCode : "",
      });

      if (paymentMethod === "COD") {
        clearCart();
        navigate(`/order-success/${order._id}`);
        return;
      }

      // JazzCash or EasyPaisa: initiate payment, then auto-submit redirect form
      const endpoint = paymentMethod === "JazzCash" ? "/payments/jazzcash/initiate" : "/payments/easypaisa/initiate";
      const { data: paymentData } = await api.post(endpoint, { orderId: order._id });

      clearCart();

      // Build and submit a hidden form to the payment gateway
      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentData.apiUrl;
      Object.entries(paymentData.payload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display font-700 text-2xl mb-6">Checkout</h1>
      <form onSubmit={placeOrder} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-card p-5">
            <h3 className="font-semibold mb-4">Shipping Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <input name="fullName" value={shipping.fullName} onChange={handleChange} required placeholder="Full Name" className="border rounded px-3 py-2 text-sm col-span-2" />
              <input name="phone" value={shipping.phone} onChange={handleChange} required placeholder="Phone Number (03xxxxxxxxx)" className="border rounded px-3 py-2 text-sm col-span-2" />
              <input name="street" value={shipping.street} onChange={handleChange} required placeholder="Street Address" className="border rounded px-3 py-2 text-sm col-span-2" />
              <input name="city" value={shipping.city} onChange={handleChange} required placeholder="City" className="border rounded px-3 py-2 text-sm" />
              <input name="province" value={shipping.province} onChange={handleChange} required placeholder="Province" className="border rounded px-3 py-2 text-sm" />
              <input name="postalCode" value={shipping.postalCode} onChange={handleChange} placeholder="Postal Code" className="border rounded px-3 py-2 text-sm col-span-2" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-5">
            <h3 className="font-semibold mb-4">Payment Method</h3>
            <div className="space-y-2">
              {[
                { value: "COD", label: "Cash on Delivery" },
                { value: "JazzCash", label: "JazzCash Mobile Account" },
                { value: "EasyPaisa", label: "EasyPaisa" },
              ].map((opt) => (
                <label key={opt.value} className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer ${paymentMethod === opt.value ? "border-primary-700 bg-primary-50" : "border-gray-200"}`}>
                  <input type="radio" name="paymentMethod" value={opt.value} checked={paymentMethod === opt.value} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span className="text-sm font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-5 h-fit">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-1 text-sm mb-3">
            {cartItems.map((i) => (
              <div key={i.product} className="flex justify-between text-gray-600">
                <span>{i.name} × {i.qty}</span>
                <span>Rs. {(i.price * i.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code" className="flex-1 border rounded px-3 py-1.5 text-sm" />
            <button type="button" onClick={applyCoupon} disabled={applying} className="text-xs font-semibold bg-ink text-white px-3 rounded">
              {applying ? "..." : "Apply"}
            </button>
          </div>

          <div className="border-t pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs. {itemsPrice.toLocaleString()}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-Rs. {discount.toLocaleString()}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span>{shippingPrice === 0 ? "Free" : `Rs. ${shippingPrice}`}</span></div>
            <div className="flex justify-between font-semibold text-base border-t pt-2 mt-1"><span>Total</span><span>Rs. {totalPrice.toLocaleString()}</span></div>
          </div>

          <button type="submit" disabled={placing} className="w-full mt-5 bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 rounded-full transition disabled:opacity-60">
            {placing ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
