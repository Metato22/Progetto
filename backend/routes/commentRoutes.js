const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyAccessToken } = require('../middlewares/authMiddleware');

// POST /api/comments/:id
router.post('/:id', verifyAccessToken, commentController.commentNews);

// GET /api/comments/:id?page=0&limit=10
router.get('/:id', commentController.getCommentsByNews);

module.exports = router;