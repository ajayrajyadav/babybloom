import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  babyId: { type: mongoose.Schema.Types.ObjectId, ref: "BabyProfile", required: true },
  type: { type: String, enum: ["Feeding", "Diaper Change", "Sleep"], required: true },
  details: { type: String },
  timestamp: { type: Date, required: true, default: Date.now }
});

export default mongoose.model("ActivityLog", activityLogSchema);
