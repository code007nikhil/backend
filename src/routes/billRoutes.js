import express from "express";
import {
  getAllBills,
  getBillById,
  getBillsByCompanyId,
  createBill,
  updateBill,
  deleteBill,
} from "../controllers/billController.js";

const router = express.Router();

// Get all bills
router.get("/", getAllBills);

// Get bills by company ID (more specific route first)
router.get("/company/:companyId", getBillsByCompanyId);

// Get bill by ID
router.get("/:id", getBillById);

// Create a new bill
router.post("/", createBill);

// Update bill
router.put("/:id", updateBill);

// Delete bill
router.delete("/:id", deleteBill);

export default router;
