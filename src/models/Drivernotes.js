import mongoose from "mongoose";

const driverNoteSchema = new mongoose.Schema(
  {
    driverNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    driverName: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Speeds up the "get all notes for a driver, newest first" query used by the frontend
driverNoteSchema.index({ driverNumber: 1, createdAt: -1 });

const DriverNote = mongoose.model("DriverNote", driverNoteSchema);

export default DriverNote;