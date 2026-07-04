import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc Get all users
// @route GET /api/admin/users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.json(users);
});

// @desc Update a user's role or active status
// @route PUT /api/admin/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (req.body.role) user.role = req.body.role;
  if (req.body.isActive !== undefined) user.isActive = req.body.isActive;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role, isActive: updated.isActive });
});

// @desc Delete a user
// @route DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await user.deleteOne();
  res.json({ message: "User removed" });
});

// @desc Analytics summary for dashboard
// @route GET /api/admin/analytics
export const getAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "customer" });
  const totalProducts = await Product.countDocuments({});
  const totalOrders = await Order.countDocuments({});

  const revenueAgg = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const salesTrend = await Order.aggregate([
    { $match: { createdAt: { $gte: last7Days } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topProducts = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        name: { $first: "$orderItems.name" },
        totalSold: { $sum: "$orderItems.qty" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  const lowStock = await Product.find({ countInStock: { $lte: 5 } })
    .select("name countInStock")
    .limit(10);

  res.json({
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    ordersByStatus,
    salesTrend,
    topProducts,
    lowStock,
  });
});
