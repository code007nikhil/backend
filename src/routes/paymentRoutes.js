import express from "express";
import {
  createPayment,
  getPayments,
  getPaymentsByCompany,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentSummary,
  getAllPaymentSummaries,
} from "../controllers/paymentController.js";

const router = express.Router();

// Create a new payment
router.post("/", createPayment);

// Get all payments
router.get("/", getPayments);

// Get all payment summaries for dashboard
router.get("/summaries/all", getAllPaymentSummaries);

// Get payment summary by company
router.get("/summary/:companyId", getPaymentSummary);

// Get payments by company
router.get("/company/:companyId", getPaymentsByCompany);

// Get payment by ID
router.get("/:id", getPaymentById);

// Update payment
router.patch("/:id", updatePayment);

// Delete payment
router.delete("/:id", deletePayment);

export default router;
