import Company from "../models/Company.js";

// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ status: "active" }).sort({ createdAt: -1 });
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies", error: error.message });
  }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error fetching company", error: error.message });
  }
};

// Create a new company
export const createCompany = async (req, res) => {
  try {
    const { name, description, contactPerson, contactNumber, email, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(409).json({ message: "Company with this name already exists" });
    }

    const company = new Company({
      name,
      description,
      contactPerson,
      contactNumber,
      email,
      address,
    });

    await company.save();
    res.status(201).json({ message: "Company created successfully", company });
  } catch (error) {
    res.status(500).json({ message: "Error creating company", error: error.message });
  }
};

// Update company
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, contactPerson, contactNumber, email, address, status } = req.body;

    const company = await Company.findByIdAndUpdate(
      id,
      { name, description, contactPerson, contactNumber, email, address, status },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company updated successfully", company });
  } catch (error) {
    res.status(500).json({ message: "Error updating company", error: error.message });
  }
};

// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByIdAndUpdate(
      id,
      { status: "inactive" },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted successfully", company });
  } catch (error) {
    res.status(500).json({ message: "Error deleting company", error: error.message });
  }
};
