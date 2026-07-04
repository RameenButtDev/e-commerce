import express from "express";
import { getUsers, updateUser, deleteUser, getAnalytics } from "../controllers/adminController.js";
import { getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, admin);

router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

router.get("/analytics", getAnalytics);

export default router;
