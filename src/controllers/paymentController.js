import Payment from "../models/Payment.js";

// Create a new payment
export const createPayment = async (req, res) => {
  try {
    const { companyId, companyName, amount, paymentDate, paymentMethod, description, referenceNumber, vehicleIds, notes } = req.body;

    if (!companyId || !companyName || !amount || !paymentDate || !paymentMethod) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const payment = new Payment({
      companyId,
      companyName,
      amount,
      paymentDate,
      paymentMethod,
      description,
      referenceNumber,
      vehicleIds: vehicleIds || [],
      notes,
    });

    await payment.save();
    res.status(201).json({ message: "Payment recorded successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Error creating payment", error: error.message });
  }
};

// Get all payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ paymentDate: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};

// Get payments by company
export const getPaymentsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    const payments = await Payment.find({ companyId }).sort({ paymentDate: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment", error: error.message });
  }
};

// Update payment
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId, companyName, amount, paymentDate, paymentMethod, description, referenceNumber, vehicleIds, status, notes } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      id,
      {
        companyId,
        companyName,
        amount,
        paymentDate,
        paymentMethod,
        description,
        referenceNumber,
        vehicleIds,
        status,
        notes,
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment updated successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment", error: error.message });
  }
};

// Delete payment
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment deleted successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error: error.message });
  }
};

// Get payment summary by company
export const getPaymentSummary = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    const payments = await Payment.find({ companyId, status: "completed" });
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const paymentCount = payments.length;
    const lastPaymentDate = payments.length > 0 ? payments[0].paymentDate : null;

    res.status(200).json({
      companyId,
      totalPaid,
      paymentCount,
      lastPaymentDate,
      payments,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment summary", error: error.message });
  }
};

// Get all payment summaries for dashboard
export const getAllPaymentSummaries = async (req, res) => {
  try {
    const { excludeMethods } = req.query;

    const query = { status: "completed" };
    if (excludeMethods) {
      const methods = excludeMethods.split(",").map((m) => m.trim());
      query.paymentMethod = { $nin: methods };
    }

    const payments = await Payment.find(query);

    const summaryMap = new Map();
    payments.forEach((payment) => {
      if (!summaryMap.has(payment.companyId)) {
        summaryMap.set(payment.companyId, {
          companyId: payment.companyId,
          companyName: payment.companyName,
          totalPaid: 0,
          paymentCount: 0,
          lastPaymentDate: null,
        });
      }
      const summary = summaryMap.get(payment.companyId);
      summary.totalPaid += payment.amount;
      summary.paymentCount += 1;
      if (!summary.lastPaymentDate || new Date(payment.paymentDate) > new Date(summary.lastPaymentDate)) {
        summary.lastPaymentDate = payment.paymentDate;
      }
    });

    const summaries = Array.from(summaryMap.values());
    res.status(200).json(summaries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment summaries", error: error.message });
  }
};
