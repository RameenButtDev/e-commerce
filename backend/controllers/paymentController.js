import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import { buildJazzCashPayload, verifyJazzCashCallback } from "../utils/jazzcash.js";
import { buildEasyPaisaPayload, verifyEasyPaisaCallback } from "../utils/easypaisa.js";

// @desc Initiate JazzCash payment for an order
// @route POST /api/payments/jazzcash/initiate
export const initiateJazzCash = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const { apiUrl, payload } = buildJazzCashPayload({
    amountInRupees: order.totalPrice,
    orderId: order._id.toString(),
    description: `Order #${order._id}`,
  });

  // Frontend will auto-submit this payload as a POST form to apiUrl
  res.json({ apiUrl, payload });
});

// @desc JazzCash redirects/posts back here after payment
// @route POST /api/payments/jazzcash/callback
export const jazzCashCallback = asyncHandler(async (req, res) => {
  const params = req.body;
  const isValid = verifyJazzCashCallback(params);

  const orderId = params.pp_BillReference;
  const order = await Order.findById(orderId);

  if (order && isValid) {
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "Processing";
    order.paymentResult = {
      id: params.pp_TxnRefNo,
      status: params.pp_ResponseCode,
      updateTime: new Date().toISOString(),
      raw: params,
    };
    await order.save();
    return res.redirect(`${process.env.CLIENT_URL}/order-success/${order._id}?paid=true`);
  }

  return res.redirect(`${process.env.CLIENT_URL}/order-success/${orderId}?paid=false`);
});

// @desc Initiate EasyPaisa payment
// @route POST /api/payments/easypaisa/initiate
export const initiateEasyPaisa = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const payload = buildEasyPaisaPayload({
    amountInRupees: order.totalPrice,
    orderId: order._id.toString(),
  });

  res.json({ apiUrl: "https://easypay.easypaisa.com.pk/easypay/Index.jsf", payload });
});

// @desc EasyPaisa callback
// @route POST /api/payments/easypaisa/callback
export const easyPaisaCallback = asyncHandler(async (req, res) => {
  const params = req.body;
  const isValid = verifyEasyPaisaCallback(params);
  const orderId = params.orderRefNum?.replace(/^EP/, "").slice(0, 24);

  const order = await Order.findById(orderId).catch(() => null);

  if (order && isValid) {
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "Processing";
    order.paymentResult = {
      id: params.orderRefNum,
      status: params.status,
      updateTime: new Date().toISOString(),
      raw: params,
    };
    await order.save();
    return res.redirect(`${process.env.CLIENT_URL}/order-success/${order._id}?paid=true`);
  }

  return res.redirect(`${process.env.CLIENT_URL}/order-success/${orderId}?paid=false`);
});
