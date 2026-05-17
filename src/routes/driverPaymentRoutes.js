import express from "express";
import {
  createPayment,
  getDriverPayments,
  getDriverBalance,
  updatePayment,
  deletePayment,
} from "../controllers/driverPaymentController.js";

const router = express.Router();

router.post("/", createPayment);
router.get("/driver/:driverNumber/balance", getDriverBalance);
router.get("/driver/:driverNumber", getDriverPayments);
router.patch("/:paymentId", updatePayment);
router.delete("/:paymentId", deletePayment);

export default router;
