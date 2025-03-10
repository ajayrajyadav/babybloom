const express = require('express');
const router = express.Router();

// Baby Controller - CRUD Endpoints

router.get('/', async (req, res) => {
    res.json({ message: 'GET request - Baby Controller' });
});

router.post('/', async (req, res) => {
    res.json({ message: 'POST request - Baby Controller' });
});

router.put('/:id', async (req, res) => {
    res.json({ message: 'PUT request - Baby Controller' });
});

router.delete('/:id', async (req, res) => {
    res.json({ message: 'DELETE request - Baby Controller' });
});

export default babyController;
