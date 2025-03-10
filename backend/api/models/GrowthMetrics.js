import mongoose from "mongoose";

const growthMetricsSchema = new mongoose.Schema({
  babyId: { type: mongoose.Schema.Types.ObjectId, ref: "BabyProfile", required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  headCircumference: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now }
});

export default mongoose.model("GrowthMetrics", growthMetricsSchema);
