// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register
router.post('/register');

// POST /api/auth/login
router.post('/login');

// POST /api/auth/refresh
router.post('/refresh');

// POST /api/auth/logout
router.post('/logout');

module.exports = router;