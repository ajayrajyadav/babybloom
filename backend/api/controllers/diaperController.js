const express = require('express');
const router = express.Router();

// Diaper Controller - CRUD Endpoints

router.get('/', async (req, res) => {
    res.json({ message: 'GET request - Diaper Controller' });
});

router.post('/', async (req, res) => {
    res.json({ message: 'POST request - Diaper Controller' });
});

router.put('/:id', async (req, res) => {
    res.json({ message: 'PUT request - Diaper Controller' });
});

router.delete('/:id', async (req, res) => {
    res.json({ message: 'DELETE request - Diaper Controller' });
});

export default diapercController;
