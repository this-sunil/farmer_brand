import express from 'express';
const router = express.Router();
import {
  createPayment,
  checkPaymentStatus,
  phonePeCallback
} from "../controller/paymentController.js";
import upload from '../middleware/upload.js';

router.post("/create", upload.none(),createPayment);
router.get("/status/:transactionId",upload.none(), checkPaymentStatus);
router.post("/callback",upload.none(), phonePeCallback);

export default router;
