import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Debugging logs for registered routes
console.log("🛠 Before Registering Routes:", app._router?.stack.map(r => r.route?.path).filter(Boolean));
console.log("📌 Adding /api/auth routes now...");
app.use('/api/auth', authRoutes);
console.log("✅ /api/auth added.");
console.log("🛠 After Registering Routes:", app._router?.stack.map(r => r.route?.path).filter(Boolean));

const PORT = process.env.PORT || 5001;

let server = null;

// Prevent server from starting during tests
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export { app, server };