import Route from "../models/Route.js";

// Get all routes
export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find({ status: "active" }).sort({ createdAt: -1 });
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching routes", error: error.message });
  }
};

// Get route by ID
export const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findById(id);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ message: "Error fetching route", error: error.message });
  }
};

// Create a new route
export const createRoute = async (req, res) => {
  try {
    const { name, description, startLocation, endLocation, distance, estimatedDuration, difficulty } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Route name is required" });
    }

    // Check if route already exists
    const existingRoute = await Route.findOne({ name });
    if (existingRoute) {
      return res.status(409).json({ message: "Route with this name already exists" });
    }

    const route = new Route({
      name,
      description,
      startLocation,
      endLocation,
      distance,
      estimatedDuration,
      difficulty,
    });

    await route.save();
    res.status(201).json({ message: "Route created successfully", route });
  } catch (error) {
    res.status(500).json({ message: "Error creating route", error: error.message });
  }
};

// Update route
export const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startLocation, endLocation, distance, estimatedDuration, difficulty, status } = req.body;

    const route = await Route.findByIdAndUpdate(
      id,
      { name, description, startLocation, endLocation, distance, estimatedDuration, difficulty, status },
      { new: true }
    );

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.status(200).json({ message: "Route updated successfully", route });
  } catch (error) {
    res.status(500).json({ message: "Error updating route", error: error.message });
  }
};

// Delete route
export const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Route.findByIdAndUpdate(
      id,
      { status: "inactive" },
      { new: true }
    );

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.status(200).json({ message: "Route deleted successfully", route });
  } catch (error) {
    res.status(500).json({ message: "Error deleting route", error: error.message });
  }
};
