const express = require('express');
const router = express.Router();
const Baby = require('../models/Baby');
const authenticateUser = require('../middleware/authMiddleware');

// 🔒 Protect all baby routes
router.use(authenticateUser);

// 👶 Create a baby profile
router.post('/', async (req, res) => {
  try {
    console.log("📥 Incoming create baby request body:", req.body);
    const newBaby = new Baby({
      name: req.body.name,
      birthdate: req.body.birthdate,
      gender: req.body.gender,
      userId: req.user.userId, // ✅ From decoded JWT
    });
    const savedBaby = await newBaby.save();
    res.status(201).json(savedBaby);
  } catch (error) {
    console.error("❌ Error creating baby:", error.message);
    res.status(500).json({ error: 'Error creating baby profile' });
  }
});

// 📋 Get all babies for the logged-in user
router.get('/', async (req, res) => {
  try {
    const babies = await Baby.find({ userId: req.user.userId });
    res.status(200).json(babies);
  } catch (error) {
    console.error("❌ Error fetching babies:", error.message);
    res.status(500).json({ error: 'Error fetching baby profiles' });
  }
});

// 🔍 Get a specific baby profile
router.get('/:id', async (req, res) => {
  try {
    const baby = await Baby.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!baby) return res.status(404).json({ message: 'Baby not found' });
    res.status(200).json(baby);
  } catch (err) {
    console.error("❌ Error fetching baby by ID:", err.message);
    res.status(500).json({ message: 'Error retrieving baby profile' });
  }
});

// ✏️ Update a baby profile
router.put('/:id', async (req, res) => {
  try {
    const updatedBaby = await Baby.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updatedBaby) return res.status(404).json({ message: 'Baby not found or unauthorized' });
    res.status(200).json(updatedBaby);
  } catch (error) {
    console.error("❌ Error updating baby:", error.message);
    res.status(500).json({ message: 'Error updating baby profile' });
  }
});

// 🗑️ Delete a baby profile
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Baby.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!deleted) return res.status(404).json({ message: 'Baby not found or unauthorized' });
    res.status(200).json({ message: 'Baby profile deleted' });
  } catch (error) {
    console.error("❌ Error deleting baby:", error.message);
    res.status(500).json({ message: 'Error deleting baby profile' });
  }
});

module.exports = router;