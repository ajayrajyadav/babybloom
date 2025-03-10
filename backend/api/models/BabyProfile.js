import mongoose from "mongoose";

const babyProfileSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("BabyProfile", babyProfileSchema);
