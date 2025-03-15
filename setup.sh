#!/bin/bash

echo "🚀 Setting up RBAC and Token Refresh..."

BASE_DIR="$(pwd)/backend/api"

# ✅ Update userModel.js to include role field
echo "📝 Updating userModel.js..."
cat > "$BASE_DIR/models/userModel.js" <<EOL
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // ✅ Role field added
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
EOL

# ✅ Update roleMiddleware.js for Role-Based Access Control
echo "🛡️ Updating roleMiddleware.js..."
cat > "$BASE_DIR/middleware/roleMiddleware.js" <<EOL
export const authorizeRoles = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
EOL

# ✅ Update authController.js to include refresh token logic
echo "🔄 Updating authController.js with Token Refresh..."
cat > "$BASE_DIR/controllers/authController.js" <<EOL
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id, user.role);
    return res.json({ token, message: 'Login successful' });
  }
  res.status(401).json({ message: 'Invalid credentials' });
};

export const refreshToken = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = generateToken(decoded.userId, decoded.role);
    return res.json({ token: newToken });
  } catch (error) {
    return res.status(401).json({ message: 'Token expired or invalid' });
  }
};
EOL

# ✅ Update authRoutes.js to add refresh-token route
echo "🛠️ Updating authRoutes.js..."
cat > "$BASE_DIR/routes/authRoutes.js" <<EOL
import express from 'express';
import { login, refreshToken } from '../controllers/authController.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get('/admin', protect, authorizeRole('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

export default router;
EOL

echo "✅ RBAC & Token Refresh Setup Completed! 🚀"