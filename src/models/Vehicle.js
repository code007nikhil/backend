import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    driverName: {
      type: String,
      required: true,
    },
    driverNumber: {
      type: String,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    priceToDriver: {
      type: String,
      required: true,
    },
    vehicleName: {
      type: String,
      required: true,
    },
    additionalDetails: {
      type: String,
      default: "",
    },
    paidStatus: {
      type: String,
      enum: ["not paid", "paid"],
      default: "not paid",
    },
    commission: {
      type: String,
      enum: ["0", "10", "Tanken", "not Tanken"],
      default: "not Tanken",
    },
    commissionAmount: {
      type: String,
      default: "0",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
