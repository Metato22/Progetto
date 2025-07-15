const express = require('express');
const router = express.Router();

// Importa il controller utente
const userController = require('../controllers/userController');

// Importa il middleware di autenticazione JWT
const { verifyAccessToken } = require('../middlewares/authMiddleware');

// GET /api/user/me
// Restituisce il profilo utente autenticato
router.get('/me', verifyAccessToken, userController.getProfile);

// POST /api/user/upgrade
// Simula un upgrade del livello di abbonamento
router.post('/upgrade', verifyAccessToken, userController.upgradePlan);

// POST /api/user/subscribe
router.post('/subscribe', verifyAccessToken, userController.subscribe);

// GET /api/user/subscriptions
router.get('/subscriptions', verifyAccessToken, userController.getSubscriptions);

router.post('/unsubscribe', verifyAccessToken, userController.unsubscribe);

module.exports = router;