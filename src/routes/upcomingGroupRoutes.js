import express from "express";
import {
  getAllGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  getCompanies,
} from "../controllers/upcomingGroupController.js";

const router = express.Router();

// ─── Routes ────────────────────────────────────────────────────────────────────

// Get all upcoming groups with optional filters
router.get("/", getAllGroups);

// Get unique companies
router.get("/companies/list", getCompanies);

// Get single group
router.get("/:id", getGroup);

// Create new group
router.post("/", createGroup);

// Update group
router.put("/:id", updateGroup);

// Delete group
router.delete("/:id", deleteGroup);

export default router;
