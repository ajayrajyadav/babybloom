import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: 'Refresh token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) return res.status(403).json({ message: 'Invalid refresh token' });

    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '15m' }
    );

    res.json({ token: newAccessToken });

  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};
