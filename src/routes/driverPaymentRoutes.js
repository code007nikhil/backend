import express from "express";
import {
  createPayment,
  getDriverPayments,
  getDriverBalance,
  updatePayment,
  deletePayment,
  getAllPayments,
} from "../controllers/driverPaymentController.js";

const router = express.Router();

// Specific routes first (with /driver/ prefix)
router.get("/driver/:driverNumber/balance", getDriverBalance);
router.get("/driver/:driverNumber", getDriverPayments);

// Generic routes
router.post("/", createPayment);
router.get("/", getAllPayments);
router.patch("/:paymentId", updatePayment);
router.delete("/:paymentId", deletePayment);

export default router;
