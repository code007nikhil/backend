import mongoose from "mongoose";

const upcomingGroupSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    trekkers: {
      type: String,
      required: true,
      min: 1,
    },
    jiskunDate: {
      type: String,
      required: true,
    },
    rontiGadhDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Arrived", "Not Arrived"],
      default: "Not Arrived",
    },
  },
  { timestamps: true }
);

export default mongoose.model("UpcomingGroup", upcomingGroupSchema);
