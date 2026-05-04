import express from "express";
import {
  createVehicle,
  getVehicles,
  getVehiclesByCompanyAndRoute,
  getVehiclesByDateCompanyRoute,
  getVehiclesByCompany,
  getVehicleById,
  updateVehicle,
  updatePaidStatus,
  deleteVehicle,
  getDriverDetails,
} from "../controllers/vehicleController.js";

const router = express.Router();

// Create a new vehicle
router.post("/", createVehicle);

// Get all vehicles
router.get("/", getVehicles);

// Get vehicles by company
router.get("/company/list", getVehiclesByCompany);

// Get vehicles by company and route
router.get("/company-route", getVehiclesByCompanyAndRoute);

// Get vehicles by date, company, and route
router.get("/filter", getVehiclesByDateCompanyRoute);

// Get driver details by driver number (must come before /:id)
router.get("/driver/:driverNumber", getDriverDetails);

// Get vehicle by ID
router.get("/:id", getVehicleById);

// Update vehicle
router.put("/:id", updateVehicle);

// Update paid status
router.patch("/:id/paid-status", updatePaidStatus);

// Delete vehicle
router.delete("/:id", deleteVehicle);

export default router;
