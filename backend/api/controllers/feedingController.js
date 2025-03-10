const express = require('express');
const router = express.Router();

// Feeding Controller - CRUD Endpoints

router.get('/', async (req, res) => {
    res.json({ message: 'GET request - Feeding Controller' });
});

router.post('/', async (req, res) => {
    res.json({ message: 'POST request - Feeding Controller' });
});

router.put('/:id', async (req, res) => {
    res.json({ message: 'PUT request - Feeding Controller' });
});

router.delete('/:id', async (req, res) => {
    res.json({ message: 'DELETE request - Feeding Controller' });
});

export default feedingController;
