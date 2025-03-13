import express from 'express';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: `Welcome, admin ${req.user.userId}` });
});

export default router;
