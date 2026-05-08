import Expense from "../models/Expense.js";
import Company from "../models/Company.js";

// ─── Get All Expenses ──────────────────────────────────────────────
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ expenseDate: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching expenses", details: error.message });
  }
};

// ─── Get Expenses by Company ───────────────────────────────────────
export const getExpensesByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const expenses = await Expense.find({ companyId }).sort({
      expenseDate: -1,
    });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      error: "Error fetching company expenses",
      details: error.message,
    });
  }
};

// ─── Get Expense by ID ─────────────────────────────────────────────
export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({
      error: "Error fetching expense",
      details: error.message,
    });
  }
};

// ─── Create Expense ───────────────────────────────────────────────
export const createExpense = async (req, res) => {
  try {
    const {
      companyId,
      companyName,
      purpose,
      details,
      billUrl,
      totalCost,
      expenseDate,
    } = req.body;

    // Validation
    if (!companyId || !companyName || !purpose || !details || !totalCost) {
      return res.status(400).json({
        error:
          "Missing required fields: companyId, companyName, purpose, details, totalCost",
      });
    }

    // Verify company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const expense = new Expense({
      companyId,
      companyName,
      purpose,
      details,
      billUrl: billUrl || "",
      totalCost,
      expenseDate: expenseDate || new Date(),
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({
      error: "Error creating expense",
      details: error.message,
    });
  }
};

// ─── Update Expense ───────────────────────────────────────────────
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { purpose, details, billUrl, totalCost, expenseDate, status } =
      req.body;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    if (purpose) expense.purpose = purpose;
    if (details) expense.details = details;
    if (billUrl !== undefined) expense.billUrl = billUrl;
    if (totalCost) expense.totalCost = totalCost;
    if (expenseDate) expense.expenseDate = expenseDate;
    if (status) expense.status = status;

    await expense.save();
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({
      error: "Error updating expense",
      details: error.message,
    });
  }
};

// ─── Delete Expense ───────────────────────────────────────────────
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Error deleting expense",
      details: error.message,
    });
  }
};

// ─── Get Expense Summary by Company ────────────────────────────────
export const getExpenseSummaryByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const expenses = await Expense.find({ companyId });

    const totalExpense = expenses.reduce(
      (sum, exp) => sum + (exp.totalCost || 0),
      0
    );
    const byPurpose = {};
    expenses.forEach((exp) => {
      if (!byPurpose[exp.purpose]) byPurpose[exp.purpose] = 0;
      byPurpose[exp.purpose] += exp.totalCost;
    });

    const byStatus = {};
    expenses.forEach((exp) => {
      if (!byStatus[exp.status]) byStatus[exp.status] = 0;
      byStatus[exp.status] += exp.totalCost;
    });

    res.status(200).json({
      companyId,
      totalExpense,
      expenseCount: expenses.length,
      byPurpose,
      byStatus,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error fetching expense summary",
      details: error.message,
    });
  }
};

// ─── Get Overall Expense Summary ───────────────────────────────────
export const getOverallExpenseSummary = async (req, res) => {
  try {
    const expenses = await Expense.find();

    const totalExpense = expenses.reduce(
      (sum, exp) => sum + (exp.totalCost || 0),
      0
    );
    const byPurpose = {};
    const byCompany = {};
    const byStatus = {};

    expenses.forEach((exp) => {
      if (!byPurpose[exp.purpose]) byPurpose[exp.purpose] = 0;
      byPurpose[exp.purpose] += exp.totalCost;

      if (!byCompany[exp.companyName]) byCompany[exp.companyName] = 0;
      byCompany[exp.companyName] += exp.totalCost;

      if (!byStatus[exp.status]) byStatus[exp.status] = 0;
      byStatus[exp.status] += exp.totalCost;
    });

    res.status(200).json({
      totalExpense,
      expenseCount: expenses.length,
      byPurpose,
      byCompany,
      byStatus,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error fetching overall summary",
      details: error.message,
    });
  }
};
