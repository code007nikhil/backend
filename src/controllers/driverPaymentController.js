import DriverPayment from "../models/DriverPayment.js";
import Vehicle from "../models/Vehicle.js";
import { calculateDriverLedger } from "../utils/driverLedger.js";

// Create a new payment
export const createPayment = async (req, res) => {
  try {
    const { driverNumber, driverName, paymentDate, amountPaid, paymentMethod, notes, recordedBy } = req.body;

    if (!driverNumber || !driverName || !paymentDate || !amountPaid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const payment = new DriverPayment({
      driverNumber,
      driverName,
      paymentDate,
      amountPaid,
      paymentMethod: paymentMethod || "cash",
      notes: notes || "",
      recordedBy: recordedBy || "admin",
    });

    await payment.save();
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ message: "Error creating payment", error: error.message });
  }
};

// Get balance summary: total owed from trips minus cash payments recorded
export const getDriverBalance = async (req, res) => {
  try {
    const { driverNumber } = req.params;

    if (!driverNumber) {
      return res.status(400).json({ message: "Driver number is required" });
    }

    const trips = await Vehicle.find({ driverNumber });
    const payments = await DriverPayment.find({ driverNumber });
    const ledger = calculateDriverLedger(trips, payments);

    const driverName = trips[0]?.driverName || payments[0]?.driverName || "";

    res.status(200).json({
      success: true,
      data: {
        driverNumber,
        driverName,
        totalTrips: trips.length,
        ...ledger,
        paymentCount: payments.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching driver balance", error: error.message });
  }
};

// Get all payments for a driver
export const getDriverPayments = async (req, res) => {
  try {
    const { driverNumber } = req.params;

    if (!driverNumber) {
      return res.status(400).json({ message: "Driver number is required" });
    }

    const payments = await DriverPayment.find({ driverNumber }).sort({ paymentDate: -1 });
    const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);

    res.status(200).json({
      success: true,
      data: {
        payments,
        totalPaid,
        paymentCount: payments.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};

// Update a payment
export const updatePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { paymentDate, amountPaid, paymentMethod, notes } = req.body;

    const payment = await DriverPayment.findByIdAndUpdate(
      paymentId,
      {
        ...(paymentDate && { paymentDate }),
        ...(amountPaid && { amountPaid }),
        ...(paymentMethod && { paymentMethod }),
        ...(notes && { notes }),
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment", error: error.message });
  }
};

// Delete a payment
export const deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await DriverPayment.findByIdAndDelete(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ success: true, message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error: error.message });
  }
};
