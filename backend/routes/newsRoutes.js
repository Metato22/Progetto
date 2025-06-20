// routes/newsRoutes.js
const express = require('express');
const router = express.Router();

// GET /api/news
router.get('/');

// GET /api/news/:id
router.get('/:id');

// POST /api/news
router.post('/');

// PUT /api/news/:id
router.put('/:id');

// DELETE /api/news/:id
router.delete('/:id');

module.exports = router;