import Vehicle from "../models/Vehicle.js";

// Create a new vehicle
export const createVehicle = async (req, res) => {
  try {
    const { companyId, companyName, driverName, driverNumber, vehicleName, vehicleNumber, route, date, priceToDriver, additionalDetails } = req.body;

    if (!companyId || !companyName || !driverName || !driverNumber || !vehicleName || !vehicleNumber || !route || !date || !priceToDriver) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const vehicle = new Vehicle({
      companyId,
      companyName,
      driverName,
      driverNumber,
      vehicleName,
      vehicleNumber,
      route,
      date,
      priceToDriver,
      additionalDetails,
    });

    await vehicle.save();
    res.status(201).json({ message: "Vehicle added successfully", vehicle });
  } catch (error) {
    res.status(500).json({ message: "Error creating vehicle", error: error.message });
  }
};

// Get all vehicles
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vehicles", error: error.message });
  }
};

// Get vehicles by company and route
export const getVehiclesByCompanyAndRoute = async (req, res) => {
  try {
    const { companyId, route } = req.query;

    if (!companyId || !route) {
      return res.status(400).json({ message: "Company ID and route are required" });
    }

    const vehicles = await Vehicle.find({ companyId, route });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vehicles", error: error.message });
  }
};

// Get vehicles by date, company, and route
export const getVehiclesByDateCompanyRoute = async (req, res) => {
  try {
    const { date, companyName, route } = req.query;

    if (!date || !companyName || !route) {
      return res.status(400).json({ message: "Date, company name, and route are required" });
    }

    const vehicles = await Vehicle.find({ date, companyName, route });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vehicles", error: error.message });
  }
};

// Get vehicle by ID
export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vehicle", error: error.message });
  }
};

// Update vehicle
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverName, driverNumber, vehicleNumber, vehicleName, route, date, priceToDriver, additionalDetails } = req.body;

    if (!driverName || !driverNumber || !vehicleNumber || !vehicleName || !route || !date || !priceToDriver) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { driverName, driverNumber, vehicleNumber, vehicleName, route, date, priceToDriver, additionalDetails },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle updated successfully", vehicle });
  } catch (error) {
    res.status(500).json({ message: "Error updating vehicle", error: error.message });
  }
};

// Delete vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting vehicle", error: error.message });
  }
};

// Update paid status
export const updatePaidStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paidStatus } = req.body;

    if (!paidStatus || !["paid", "not paid"].includes(paidStatus)) {
      return res.status(400).json({ message: "Invalid paid status" });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { paidStatus },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Paid status updated successfully", vehicle });
  } catch (error) {
    res.status(500).json({ message: "Error updating paid status", error: error.message });
  }
};

// Get vehicles by company
export const getVehiclesByCompany = async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    const vehicles = await Vehicle.find({ companyId });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vehicles", error: error.message });
  }
};

export const getDriverDetails = async (req, res) => {
  try {
    const { driverNumber } = req.params;

    if (!driverNumber) {
      return res.status(400).json({ message: "Driver number is required" });
    }

    const trips = await Vehicle.find({ driverNumber }).sort({ date: -1 });

    if (trips.length === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const driverName = trips[0].driverName;
    const vehicleName = trips[0].vehicleName; // ← fixed

    const totalAmount = trips.reduce((sum, v) => sum + parseFloat(v.priceToDriver || "0"), 0);
    const paidAmount = trips
      .filter((v) => v.paidStatus === "paid")
      .reduce((sum, v) => sum + parseFloat(v.priceToDriver || "0"), 0);
    const unpaidAmount = totalAmount - paidAmount;

    const driverDetails = {
      driverName,
      driverNumber,
      vehicleName,
      totalTrips: trips.length,
      totalAmount: totalAmount.toFixed(2),
      paidAmount: paidAmount.toFixed(2),
      unpaidAmount: unpaidAmount.toFixed(2),
      trips: trips.map(trip => ({
        _id: trip._id,
        companyName: trip.companyName,
        vehicleName: trip.vehicleName, // ← fixed
        vehicleNumber: trip.vehicleNumber,
        route: trip.route,
        date: trip.date,
        priceToDriver: trip.priceToDriver,
        paidStatus: trip.paidStatus,
        additionalDetails: trip.additionalDetails,
        createdAt: trip.createdAt,
      })),
    };

    res.status(200).json(driverDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching driver details", error: error.message });
  }
};
