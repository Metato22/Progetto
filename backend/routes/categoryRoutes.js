const express = require('express');
const router = express.Router();

// Controller delle categorie
const categoryController = require('../controllers/categoryController');

// Middleware per accesso
const { verifyAccessToken, verifyRole } = require('../middlewares/authMiddleware');

// ✅ Recupera tutte le categorie
router.get('/', categoryController.getCategories);

// ✅ Crea una nuova categoria (solo admin)
router.post(
    '/',
    verifyAccessToken,
    verifyRole('admin'),
    categoryController.createCategory
);

module.exports = router;