import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

// @desc Create new order (checkout)
// @route POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  // Recalculate prices server-side from DB (never trust client totals)
  let itemsPrice = 0;
  const verifiedItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      res.status(400);
      throw new Error(`Product not available: ${item.name || item.product}`);
    }
    if (product.countInStock < item.qty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    itemsPrice += price * item.qty;
    verifiedItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || "",
      price,
      qty: item.qty,
    });
  }

  let discountAmount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
      discountAmount =
        coupon.discountType === "percentage"
          ? (itemsPrice * coupon.discountValue) / 100
          : coupon.discountValue;
      discountAmount = Math.min(discountAmount, itemsPrice);
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  const shippingPrice = itemsPrice > 5000 ? 0 : 200;
  const totalPrice = Math.max(itemsPrice - discountAmount + shippingPrice, 0);

  const order = new Order({
    user: req.user._id,
    orderItems: verifiedItems,
    shippingAddress,
    paymentMethod,
    couponCode: couponCode || "",
    itemsPrice,
    discountAmount,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  // Decrement stock
  for (const item of verifiedItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { countInStock: -item.qty } });
  }

  res.status(201).json(createdOrder);
});

// @desc Get logged-in user's orders
// @route GET /api/orders/myorders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc Get single order by id
// @route GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json(order);
});

// ---------- ADMIN ----------

// @desc Get all orders
// @route GET /api/admin/orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const status = req.query.status ? { status: req.query.status } : {};
  const orders = await Order.find(status).populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

// @desc Update order status
// @route PUT /api/admin/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.status = req.body.status || order.status;
  if (order.status === "Delivered") order.deliveredAt = new Date();
  const updated = await order.save();
  res.json(updated);
});
