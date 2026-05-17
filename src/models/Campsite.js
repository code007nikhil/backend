import mongoose from "mongoose";

const campsiteSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
      index: true,
    },
    leader: {
      type: String,
      required: true,
    },
    guides: {
      type: String,
      default: "",
    },
    clients: {
      type: Number,
      required: true,
      min: 0,
    },
    gcount: {
      type: Number,
      required: true,
      min: 0,
      description: "Number of guides",
    },
    porters: {
      type: Number,
      required: true,
      min: 0,
    },
    staff: {
      type: Number,
      required: true,
      min: 0,
    },
    staffrole: {
      type: String,
      default: "",
    },
    rtrekker: {
      type: Number,
      required: true,
      min: 0,
      description: "Rate per trekker/client",
    },
    rleader: {
      type: Number,
      required: true,
      min: 0,
      description: "Rate for leader",
    },
    rguide: {
      type: Number,
      required: true,
      min: 0,
      description: "Rate per guide",
    },
    rporter: {
      type: Number,
      required: true,
      min: 0,
      description: "Rate per porter",
    },
    rstaff: {
      type: Number,
      required: true,
      min: 0,
      description: "Rate per staff member",
    },
    paidStatus: {
      type: String,
      enum: ["paid", "not paid"],
      default: "not paid",
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Calculate total bill amount
campsiteSchema.methods.calculateBill = function () {
  return (
    this.clients * this.rtrekker +
    1 * this.rleader +
    this.gcount * this.rguide +
    this.porters * this.rporter +
    this.staff * this.rstaff
  );
};

// Calculate total people count
campsiteSchema.methods.getTotalPeople = function () {
  return this.clients + 1 + this.gcount + this.porters + this.staff;
};

export default mongoose.model("Campsite", campsiteSchema);
