const express = require('express');
const router = express.Router();
const Baby = require('../models/Baby');

// Create a baby profile
router.post('/', async (req, res) => {
  try {
    const newBaby = new Baby({ 
      name: req.body.name, 
      birthdate: req.body.birthdate, 
      gender: req.body.gender, 
      userId: req.body.userId 
     });
    const savedBaby = await newBaby.save();
    res.status(201).json(savedBaby);
  } catch (error) {
    res.status(500).json({ error: 'Error creating baby profile' });
  }
});

// Get all babies for the logged-in user
router.get('/', async (req, res) => {
  try {
    const babies = await Baby.find({ userId: req.query.userId });
    res.status(200).json(babies);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching baby profiles' });
  }
});

// Get a specific baby profile
router.get('/:id', async (req, res) => {
  try {
    const baby = await Baby.findById(req.params.id);
    if (!baby) return res.status(404).json({ error: 'Baby not found' });
    res.status(200).json(baby);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching baby profile' });
  }
});

// Update a baby profile
router.put('/:id', async (req, res) => {
  try {
    const updatedBaby = await Baby.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedBaby);
  } catch (error) {
    res.status(500).json({ error: 'Error updating baby profile' });
  }
});

// Delete a baby profile
router.delete('/:id', async (req, res) => {
  try {
    await Baby.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Baby profile deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting baby profile' });
  }
});

module.exports = router;
