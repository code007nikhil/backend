import Bill from "../models/Bill.js";
import Company from "../models/Company.js";

// Get all bills
export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate("companyId").sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bills", error: error.message });
  }
};

// Get bill by ID
export const getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findById(id).populate("companyId");

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bill", error: error.message });
  }
};

// Get bills by company ID
export const getBillsByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;
    const bills = await Bill.find({ companyId }).sort({ createdAt: -1 });

    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bills", error: error.message });
  }
};

// Create a new bill
export const createBill = async (req, res) => {
  try {
    const { companyId, companyName, date, particulars, total } = req.body;

    if (!companyId || !companyName || !date || !particulars || particulars.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const bill = new Bill({
      companyId,
      companyName,
      date,
      particulars,
      total,
    });

    await bill.save();
    res.status(201).json({ message: "Bill created successfully", bill });
  } catch (error) {
    res.status(500).json({ message: "Error creating bill", error: error.message });
  }
};

// Update bill
export const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    let { companyId, companyName, date, particulars, total, status } = req.body;

    console.log("Update request received:", { companyId, companyIdType: typeof companyId, companyIdValue: JSON.stringify(companyId) });

    // Handle companyId as either a string or object (from frontend populated response)
    if (companyId && typeof companyId === "object") {
      console.log("companyId is an object, extracting _id:", companyId);
      companyId = companyId._id || companyId.id || companyId;
    }

    console.log("After extraction:", { companyId, companyIdType: typeof companyId });

    // Build update object with only provided fields
    const updateData = {};
    if (companyId !== undefined) updateData.companyId = companyId;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (date !== undefined) updateData.date = date;
    if (particulars !== undefined) updateData.particulars = particulars;
    if (total !== undefined) updateData.total = total;
    if (status !== undefined) updateData.status = status;

    // Verify company exists if companyId is being updated
    if (updateData.companyId) {
      console.log("Verifying company exists with ID:", updateData.companyId);
      const company = await Company.findById(updateData.companyId);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
    }

    const bill = await Bill.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("companyId");

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json({ message: "Bill updated successfully", bill });
  } catch (error) {
    console.error("Error updating bill:", error);
    res.status(500).json({ message: "Error updating bill", error: error.message });
  }
};

// Delete bill
export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Bill.findByIdAndDelete(id);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bill", error: error.message });
  }
};
