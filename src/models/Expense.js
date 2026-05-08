import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    billUrl: {
      type: String,
      default: "",
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    expenseDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Not Paid"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
