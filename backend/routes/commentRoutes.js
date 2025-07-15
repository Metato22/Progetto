const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyAccessToken, verifyRole } = require('../middlewares/authMiddleware');

router.post('/:newsId', verifyAccessToken, commentController.commentNews);

router.get('/:newsId', commentController.getCommentsByNews);

router.delete('/:id', verifyAccessToken, commentController.deleteComment);

module.exports = router;