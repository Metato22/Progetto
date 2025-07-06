const express = require('express');
const router = express.Router();

// Controller delle categorie
const categoryController = require('../controllers/categoryController');

// Middleware per accesso
const { verifyAccessToken, verifyRole } = require('../middlewares/authMiddleware');

// ✅ Recupera tutte le categorie
router.get('/', categoryController.getCategories);

// ✅ Recupera una categoria specifica
router.get('/:id', categoryController.getCategoryById);

// ✅ Crea una nuova categoria (solo admin)
router.post(
    '/',
    verifyAccessToken,
    verifyRole('admin'),
    categoryController.createCategory
);

// ✅ Modifica categoria (admin)
router.put(
    '/:id',
    verifyAccessToken,
    verifyRole('admin'),
    categoryController.updateCategory
);

// ✅ Elimina categoria (admin)
router.delete(
    '/:id',
    verifyAccessToken,
    verifyRole('admin'),
    categoryController.deleteCategory
);

module.exports = router;