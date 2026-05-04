import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    startLocation: {
      type: String,
      default: "",
    },
    endLocation: {
      type: String,
      default: "",
    },
    distance: {
      type: Number,
      default: 0,
    },
    estimatedDuration: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["easy", "moderate", "hard"],
      default: "moderate",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Route", routeSchema);
