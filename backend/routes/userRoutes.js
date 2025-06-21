// routes/userRoutes.js
const express = require('express');
const router = express.Router();

// GET /api/user/me
router.get('/me');

// POST /api/user/subscribe
router.post('subscribe');

// GET /api/user/subscriptions
router.get('/subscriptions');


router.post('/upgrade', verifyAccessToken, userController.upgradeSubscription);

module.exports = router;