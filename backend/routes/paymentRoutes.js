import express from "express";
import {
  initiateJazzCash,
  jazzCashCallback,
  initiateEasyPaisa,
  easyPaisaCallback,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/jazzcash/initiate", protect, initiateJazzCash);
router.post("/jazzcash/callback", jazzCashCallback);
router.post("/easypaisa/initiate", protect, initiateEasyPaisa);
router.post("/easypaisa/callback", easyPaisaCallback);

export default router;
