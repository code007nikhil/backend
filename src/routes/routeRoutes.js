import express from "express";
import {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../controllers/routeController.js";

const router = express.Router();

// Get all routes
router.get("/", getAllRoutes);

// Get route by ID
router.get("/:id", getRouteById);

// Create a new route
router.post("/", createRoute);

// Update route
router.put("/:id", updateRoute);

// Delete route
router.delete("/:id", deleteRoute);

export default router;
