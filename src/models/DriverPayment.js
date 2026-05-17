import mongoose from "mongoose";

const driverPaymentSchema = new mongoose.Schema(
  {
    driverNumber: {
      type: String,
      required: true,
      index: true,
    },
    driverName: {
      type: String,
      required: true,
    },
    paymentDate: {
      type: String,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank transfer", "upi", "cheque", "other"],
      default: "cash",
    },
    notes: {
      type: String,
      default: "",
    },
    recordedBy: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model("DriverPayment", driverPaymentSchema);
