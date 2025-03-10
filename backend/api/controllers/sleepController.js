const express = require('express');
const router = express.Router();

// Sleep Tracking Controller - CRUD Endpoints

router.get('/', async (req, res) => {
    res.json({ message: 'GET request - Sleep Tracking Controller' });
});

router.post('/', async (req, res) => {
    res.json({ message: 'POST request - Sleep Tracking Controller' });
});

router.put('/:id', async (req, res) => {
    res.json({ message: 'PUT request - Sleep Tracking Controller' });
});

router.delete('/:id', async (req, res) => {
    res.json({ message: 'DELETE request - Sleep Tracking Controller' });
});

export default sleepController;
