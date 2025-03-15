import mongoose from "mongoose";
import crypto from "crypto";


const refreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true }, // This will be encrypted
    expiresAt: { type: Date, required: true },
});

// Encrypt token before saving
//refreshTokenSchema.pre("save", function (next) {
//    this.token = crypto.createHash("sha256").update(this.token).digest("hex");
//    next();
//});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema, "refreshTokens");

export default RefreshToken;