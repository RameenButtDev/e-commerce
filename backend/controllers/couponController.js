import asyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";

// @desc Validate a coupon code for checkout
// @route POST /api/coupons/validate
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) {
    res.status(404);
    throw new Error("Invalid coupon code");
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    res.status(400);
    throw new Error("Coupon has expired");
  }
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    res.status(400);
    throw new Error("Coupon usage limit reached");
  }
  if (orderAmount < coupon.minOrderAmount) {
    res.status(400);
    throw new Error(`Minimum order amount is Rs. ${coupon.minOrderAmount}`);
  }

  let discount =
    coupon.discountType === "percentage"
      ? (orderAmount * coupon.discountValue) / 100
      : coupon.discountValue;

  discount = Math.min(discount, orderAmount);

  res.json({ code: coupon.code, discountAmount: Math.round(discount) });
});

// ---------- ADMIN ----------
export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }
  Object.assign(coupon, req.body);
  const updated = await coupon.save();
  res.json(updated);
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }
  await coupon.deleteOne();
  res.json({ message: "Coupon removed" });
});
