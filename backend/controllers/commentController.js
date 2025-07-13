const Comment = require('../models/commentModel');

// Crea un nuovo commento legato a una notizia
exports.commentNews = async (req, res) => {
    try {
        const { text } = req.body;
        const newsId = req.params.newsId;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ message: 'Il testo del commento è obbligatorio' });
        }

        const newComment = await Comment.create({
            user: req.userId,
            news: newsId,
            text: text.trim()
        });

        const populatedComment = await newComment.populate('user', 'username');
        if (req.io) req.io.emit('new-comment', populatedComment); // opzionale
        res.status(201).json(populatedComment);
    } catch (err) {
        console.error('Errore creazione commento:', err.message);
        res.status(500).json({ message: 'Errore del server durante la creazione del commento' });
    }
};

// Ottiene tutti i commenti per una specifica notizia
exports.getCommentsByNews = async (req, res) => {
    try {
        const newsId = req.params.newsId;
        const page = parseInt(req.query.page) || 1; // pagina 1 come default
        const limit = parseInt(req.query.limit) || 10;

        const comments = await Comment.find({ news: newsId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user', 'username');

        res.json(comments);
    } catch (err) {
        console.error('Errore recupero commenti:', err.message);
        res.status(500).json({ message: 'Errore del server durante il recupero dei commenti' });
    }
};

// Elimina un commento (solo autore o admin)
exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.newsId;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Commento non trovato' });
        }

        // Controllo se è l'autore o un admin
        if (comment.user.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Non autorizzato a eliminare questo commento' });
        }

        await Comment.findByIdAndDelete(commentId);
        if (req.io) req.io.emit('comment-deleted', { id: commentId }); // opzionale socket
        res.json({ message: 'Commento eliminato con successo' });
    } catch (err) {
        console.error('Errore eliminazione commento:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
};