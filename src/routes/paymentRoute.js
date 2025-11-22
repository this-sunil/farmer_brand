import express from 'express';
const router = express.Router();
import {
  createPayment,
  checkPaymentStatus,
  phonePeCallback
} from "../controller/paymentController.js";

router.post("/create", createPayment);
router.get("/status/:transactionId", checkPaymentStatus);
router.post("/callback", phonePeCallback);

export default router;
