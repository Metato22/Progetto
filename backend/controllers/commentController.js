const Comment = require('../models/commentModel');

// Crea un nuovo commento legato a una notizia
exports.commentNews = async (req, res) => {
    const { text } = req.body;
    const newsId = req.params.id;

    const newComment = await Comment.create({
        user: req.userId,
        news: newsId,
        text
    });

    const populatedComment = await newComment.populate('user', 'username');
    req.io.emit('new-comment', populatedComment); // opzionale
    res.status(201).json(populatedComment);
};

// Ottiene tutti i commenti per una specifica notizia
exports.getCommentsByNews = async (req, res) => {
    const newsId = req.params.id;
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const comments = await Comment.find({ news: newsId })
        .sort({ createdAt: -1 })
        .skip(page * limit)
        .limit(limit)
        .populate('user', 'username');

    res.json(comments);
};