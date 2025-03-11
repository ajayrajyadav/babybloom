import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Ensure this path is correct

// Register Controller
export async function register(req, res) {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}
export const logout = async (req, res) => {
  return res.status(200).json({ message: "Logout successful" });
};
//get profile controller
export const getProfile = async (req, res) => {
  try {
      if (!req.user) {
          return res.status(401).json({ message: "Not authorized" });
      }
      return res.status(200).json({ 
          message: `Welcome, user ${req.user.userId}!`, 
          user: req.user 
      });
  } catch (error) {
      console.error("❌ Error in getProfile:", error);
      res.status(500).json({ message: "Server error" });
  }
};
// Login Controller
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}