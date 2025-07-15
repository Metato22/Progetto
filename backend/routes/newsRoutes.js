const express = require('express');
const router = express.Router();

// Controller delle notizie
const newsController = require('../controllers/newsController');

// Middleware per protezione delle rotte
const { verifyAccessToken, optionalAuth, verifyRole } = require('../middlewares/authMiddleware');

// Rotta per ottenere tutte le notizie (anteprima)
router.get('/', newsController.getAllNews);

// Rotta per ottenere una singola notizia completa
router.get('/item/:id',optionalAuth, newsController.getNewsById);

// Rotta per ottenere notizie manuali personalizzate (utente autenticato)
router.get(
    '/personalized',
    verifyAccessToken,
    newsController.getPersonalizedNews
);

// Rotta per creare una nuova notizia (solo admin)
router.post(
    '/',
    verifyAccessToken,
    verifyRole('admin'),
    newsController.createNews
);

// Rotta per aggiornare una notizia (solo admin)
router.put(
    '/:id',
    verifyAccessToken,
    verifyRole('admin'),
    newsController.updateNews
);

// Rotta per eliminare una notizia (solo admin)
router.delete(
    '/:id',
    verifyAccessToken,
    verifyRole('admin'),
    newsController.deleteNews
);

// Like toggle di una notizia (utente loggato)
router.post(
    '/:id/like',
    verifyAccessToken,
    newsController.toggleLike
);

// Dislike toggle di una notizia (utente loggato)
router.post(
    '/:id/dislike',
    verifyAccessToken,
    newsController.toggleDislike
);

module.exports = router;