import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'; // ✅ Ensure this path is correct

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// 🛠 Debugging: Check routes before adding
console.log("🛠 Before Registering Routes:", app._router?.stack.map(r => r.route?.path).filter(Boolean));

console.log("🔍 Checking if app.use() is actually called...");
console.log("📌 Adding /api/auth routes now...");
app.use('/api/auth', authRoutes);
console.log("✅ /api/auth added.");

// 🛠 Debugging: Check routes after adding
console.log("🛠 After Registering Routes:", app._router?.stack.map(r => r.route?.path).filter(Boolean));

// ✅ Debug route to check registered routes
app.get('/debug-routes', (req, res) => {
    function getRoutePaths(layer, prefix = '') {
        if (layer.route) {
            return [`${prefix}${layer.route.path}`];
        } else if (layer.name === 'router' && layer.handle.stack) {
            return layer.handle.stack.flatMap(l => getRoutePaths(l, prefix));
        }
        return [];
    }

    const routes = app._router.stack
        .flatMap(layer => getRoutePaths(layer))
        .map(route => route.replace(/^\\/, '').replace(/\?\(\?=\\\/\|\$\)/g, '')) // ✅ Removes artifacts

    res.json(routes);
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export { app, server };