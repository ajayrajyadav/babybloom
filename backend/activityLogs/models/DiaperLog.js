const mongoose = require("mongoose");

const DiaperLogSchema = new mongoose.Schema(
  {
    babyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Baby",
      required: true,
    },
    type: {
      type: String,
      default: "diaper",
      enum: ["diaper"],
    },
    time: {
      type: Date,
      required: true,
    },
    contents: {
      type: String,
      enum: ["pee", "poop", "both"],
    },
    color: {
      type: String,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["open", "completed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiaperLog", DiaperLogSchema);
