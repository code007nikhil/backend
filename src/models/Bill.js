import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    date: {
      type: String, // Store as YYYY-MM-DD string for consistency
      required: true,
    },
    particulars: [
      {
        id: String,
        description: {
          type: String,
          required: true,
        },
        rate: {
          type: Number,
          required: true,
          min: 0,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "paid"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bill", billSchema);
