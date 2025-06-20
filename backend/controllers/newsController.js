const News = require('../models/News');

// ✅ Ottiene tutte le notizie in formato anteprima per la homepage
// Include: titolo, immagine, excerpt, categoria, like/dislike
const getAllNews = async (req, res) => {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const news = await News.find(filter)
        .sort({ createdAt: -1 })
        .select('title imageUrl excerpt category likes dislikes createdAt')
        .lean();

    res.json(news);
};

// ✅ Ottiene una singola notizia completa (dettaglio)
// Include: testo completo, immagine, commenti con nome utente
const getNewsById = async (req, res) => {
    const news = await News.findById(req.params.id)
        .populate('comments.user', 'username')
        .lean();

    if (!news) return res.status(404).json({ message: 'Notizia non trovata' });
    res.json(news);
};

// ✅ Crea una nuova notizia (admin)
// Genera un excerpt automatico (primi 200 caratteri), associa categoria e autore
const createNews = async (req, res) => {
    const { title, content, category, imageUrl } = req.body;
    const excerpt = content.slice(0, 200) + '...';

    const newNews = new News({
        title,
        content,
        excerpt,
        category,
        imageUrl,
        author: req.userId
    });

    await newNews.save();

    // Invia la notizia in real-time via WebSocket
    req.io.emit('news-update', newNews);

    res.status(201).json(newNews);
};

// ✅ Aggiorna una notizia esistente (admin)
const updateNews = async (req, res) => {
    const updated = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Notizia non trovata' });

    req.io.emit('news-update', updated);
    res.json(updated);
};

// ✅ Elimina una notizia esistente (admin)
const deleteNews = async (req, res) => {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Notizia non trovata' });

    req.io.emit('news-deleted', { id: req.params.id });
    res.json({ message: 'Notizia eliminata' });
};

// ✅ Aggiunge un like alla notizia (utente autenticato)
const likeNews = async (req, res) => {
    const news = await News.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 } },
        { new: true }
    );
    res.json({ likes: news.likes });
};

// ✅ Aggiunge un dislike alla notizia (utente autenticato)
const dislikeNews = async (req, res) => {
    const news = await News.findByIdAndUpdate(
        req.params.id,
        { $inc: { dislikes: 1 } },
        { new: true }
    );
    res.json({ dislikes: news.dislikes });
};

// ✅ Aggiunge un commento alla notizia (utente autenticato)
const commentNews = async (req, res) => {
    const { text } = req.body;

    const comment = {
        user: req.userId,
        text,
        createdAt: new Date()
    };

    const news = await News.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: comment } },
        { new: true }
    ).populate('comments.user', 'username');

    res.status(201).json(news.comments);
};

module.exports = {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    likeNews,
    dislikeNews,
    commentNews
};