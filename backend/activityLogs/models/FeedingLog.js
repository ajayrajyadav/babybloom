const mongoose = require("mongoose");

const feedingLogSchema = new mongoose.Schema(
  {
    babyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Baby",
      required: true,
    },
    type: {
      type: String,
      default: "feeding",
      enum: ["feeding"],
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    amount: {
      type: Number, // in milliliters (or alternate units in future)
      required: true,
    },
    method: {
      type: String,
      enum: ["bottle", "breast", "tube", "other"],
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["open", "completed"],
      default: "open",
    },
    duration: {
      type: Number, // duration in seconds
    },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate duration before saving if endTime is present
feedingLogSchema.pre("save", function (next) {
  if (this.startTime && this.endTime) {
    this.duration =
      (new Date(this.endTime) - new Date(this.startTime)) / 1000; // duration in seconds
  }
  next();
});

const FeedingLog = mongoose.model("FeedingLog", feedingLogSchema);
module.exports = FeedingLog;