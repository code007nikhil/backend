import express from "express";
import {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";

const router = express.Router();

// Get all companies
router.get("/", getAllCompanies);

// Get company by ID
router.get("/:id", getCompanyById);

// Create a new company
router.post("/", createCompany);

// Update company
router.put("/:id", updateCompany);

// Delete company
router.delete("/:id", deleteCompany);

export default router;
