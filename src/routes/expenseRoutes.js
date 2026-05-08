import express from "express";
import {
  getAllExpenses,
  getExpensesByCompany,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummaryByCompany,
  getOverallExpenseSummary,
} from "../controllers/expenseController.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────────
router.get("/", getAllExpenses);
router.get("/summary", getOverallExpenseSummary);
router.post("/", createExpense);

// ─── Company Specific Routes ──────────────────────────────────────
router.get("/company/:companyId", getExpensesByCompany);
router.get("/company/:companyId/summary", getExpenseSummaryByCompany);

// ─── Individual Expense Routes ────────────────────────────────────
router.get("/:id", getExpenseById);
router.patch("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
