import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // ✅ Ensure Admin Routes are included
import { errorHandler } from "./middleware/errorMiddleware.js"; // ✅ Import Error Handler

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// ✅ Enable CORS with Secure Cookie Handling
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,  // ✅ Allow cookies to be sent with requests
}));

app.use(cookieParser()); // ✅ Enable cookie parsing

// ✅ Debugging logs before adding routes
console.log("🛠 Before Registering Routes:", app._router?.stack.map(r => r.route?.path).filter(Boolean));

console.log("📌 Adding /api/auth routes now...");
app.use("/api/auth", authRoutes);
console.log("✅ /api/auth added.");

console.log("📌 Adding /api/admin routes now...");
app.use("/api/admin", adminRoutes); // ✅ Ensure this is added
console.log("✅ /api/admin added.");

// ✅ Debugging logs after adding routes
console.log("🛠 After Registering Routes:", app._router?.stack.map(r => r.route?.path).filter(Boolean));

// ✅ Error handling middleware (must be after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
let server = null;

// ✅ Graceful Shutdown Handling
const startServer = () => {
    if (process.env.NODE_ENV !== "test") {
        server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

        // ✅ Handle process termination gracefully
        process.on("SIGINT", () => {
            console.log("🛑 SIGINT received. Shutting down server...");
            server.close(() => process.exit(0));
        });

        process.on("SIGTERM", () => {
            console.log("🛑 SIGTERM received. Shutting down server...");
            server.close(() => process.exit(0));
        });
    }
};

startServer();

export { app, server };