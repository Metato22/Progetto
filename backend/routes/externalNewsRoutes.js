const express = require('express');
const router = express.Router();

// Controller delle notizie esterne
const externalNewsController = require('../controllers/externalNewsController');

// Middleware per protezione delle rotte
const { verifyAccessToken } = require('../middlewares/authMiddleware');

// Tutte le notizie
router.get('/', externalNewsController.getExternalNews);

// Notizie filtrate per categorie preferite dell'utente
router.get('/personalized', verifyAccessToken, externalNewsController.getPersonalizedExternalNews); // filtrate per utente

module.exports = router;