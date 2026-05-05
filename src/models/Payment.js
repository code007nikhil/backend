import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "check", "bank transfer", "online", "other"],
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    referenceNumber: {
      type: String,
      default: "",
    },
    vehicleIds: [
      {
        type: String,
        ref: "Vehicle",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "completed",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index for faster queries
paymentSchema.index({ companyId: 1, paymentDate: -1 });

export default mongoose.model("Payment", paymentSchema);
