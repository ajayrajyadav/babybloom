import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // 7 days expiry
});

export default mongoose.model("RefreshToken", refreshTokenSchema);