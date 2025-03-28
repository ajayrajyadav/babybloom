const mongoose = require("mongoose");

const diaperLogSchema = new mongoose.Schema(
  {
    babyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Baby",
      required: true,
    },
    type: {
      type: String,
      default: "diaper",
    },
    time: {
      type: Date,
      required: true,
    },
    contents: {
      type: String,
      enum: ["wet", "BM", "both"],
      required: true,
    },
    color: {
      type: String,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      default: "completed",
    },
  },
  { timestamps: true }
);

const DiaperLog = mongoose.model("DiaperLog", diaperLogSchema);

module.exports = DiaperLog;