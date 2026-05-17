import express from "express";
import {
  getAllCampsites,
  getCampsite,
  createCampsite,
  updateCampsite,
  deleteCampsite,
  getCompanies,
  getStats,
} from "../controllers/campsiteController.js";

const router = express.Router();

// ─── Routes ────────────────────────────────────────────────────────────────────

// Get all campsites with optional filters
router.get("/", getAllCampsites);

// Get stats summary
router.get("/stats/summary", getStats);

// Get unique companies
router.get("/companies/list", getCompanies);

// Get single campsite
router.get("/:id", getCampsite);

// Create new campsite
router.post("/", createCampsite);

// Update campsite
router.put("/:id", updateCampsite);

// Delete campsite
router.delete("/:id", deleteCampsite);

export default router;
