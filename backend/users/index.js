const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("./config/config");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Enable cookie parsing
//app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // Adjust origin if needed
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/users", authRoutes);
app.use("/users", userRoutes);

// Connect to DB
connectDB();

// Start the server
if (process.env.NODE_ENV !== "test") {
    app.listen(config.port, () => console.log(`Users service running on port ${config.port}`));
}

module.exports = app; // Export for testing