import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";

// ✅ Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("🔍 TEST ENV LOADED: JWT_SECRET =", process.env.JWT_SECRET || "❌ NOT FOUND");

// ✅ Ensure DB is disconnected after tests
afterAll(async () => {
  await mongoose.connection.close();
});