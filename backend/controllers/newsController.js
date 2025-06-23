const News = require('../models/newsModel');
const Category = require('../models/categoryModel');

// 📰 Ottiene tutte le notizie accessibili all'utente
const getAllNews = async (req, res) => {
    try {
        const filter = {};
        const userLevel = req.userSubscription || 'free';

        if (req.query.category) {
            filter.category = req.query.category;
        }

        filter.accessLevel = userLevel === 'premium' ? { $in: ['free', 'premium'] } : 'free';

        const news = await News.find(filter)
            .sort({ createdAt: -1 })
            .populate('category', 'name')
            .select('title imageUrl category likes dislikes accessLevel createdAt')
            .lean({ virtuals: true });

        res.json(news.map(n => ({ ...n, excerpt: n.excerpt })));
    } catch (err) {
        console.error("Errore nel caricamento delle notizie:", err.message);
        res.status(500).json({ message: "Errore interno del server" });
    }
};

// 📄 Ottieni una singola notizia completa
const getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
            .populate('author', 'username')
            .populate('category', 'name')
            .lean();

        if (!news) return res.status(404).json({ message: 'Notizia non trovata' });

        // Controlla livello di accesso
        const userLevel = req.userSubscription || 'free';
        if (news.accessLevel === 'premium' && userLevel !== 'premium') {
            return res.status(403).json({ message: 'Contenuto riservato agli abbonati premium' });
        }

        res.json(news);
    } catch (err) {
        console.error("Errore nel recupero della notizia:", err.message);
        res.status(500).json({ message: "Errore del server" });
    }
};

// 🆕 Crea una nuova notizia (solo admin)
const createNews = async (req, res) => {
    try {
        const { title, content, category, imageUrl, accessLevel } = req.body;

        // Verifica categoria esistente
        const validCategory = await Category.findOne({ name: category });
        if (!validCategory) return res.status(400).json({ message: 'Categoria non valida' });

        const excerpt = content.slice(0, 200) + '...';

        const newNews = new News({
            title,
            content,
            excerpt,
            category,
            imageUrl,
            accessLevel: accessLevel || 'free',
            author: req.userId
        });

        await newNews.save();
        req.io.emit('news-update', newNews);

        res.status(201).json(newNews);
    } catch (err) {
        console.error('Errore creazione notizia:', err.message);
        res.status(500).json({ message: 'Errore durante la creazione della notizia' });
    }
};

// ✏️ Modifica notizia (solo admin)
const updateNews = async (req, res) => {
    try {
        const forbiddenFields = ['author', 'likes', 'dislikes', 'comments'];
        forbiddenFields.forEach(field => delete req.body[field]);

        const updated = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updated) return res.status(404).json({ message: 'Notizia non trovata' });

        req.io.emit('news-update', updated);
        res.json(updated);
    } catch (err) {
        console.error('Errore aggiornamento notizia:', err.message);
        res.status(500).json({ message: 'Errore durante l\'aggiornamento' });
    }
};

// ❌ Elimina notizia (solo admin)
const deleteNews = async (req, res) => {
    try {
        const deleted = await News.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Notizia non trovata' });

        req.io.emit('news-deleted', { id: req.params.id });
        res.json({ message: 'Notizia eliminata' });
    } catch (err) {
        console.error('Errore eliminazione notizia:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
};

// 👍 Aggiunge un like
const likeNews = async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
        res.json({ likes: news.likes });
    } catch (err) {
        res.status(500).json({ message: 'Errore del server' });
    }
};

// 👎 Aggiunge un dislike
const dislikeNews = async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, { $inc: { dislikes: 1 } }, { new: true });
        res.json({ dislikes: news.dislikes });
    } catch (err) {
        res.status(500).json({ message: 'Errore nel server' });
    }
};

module.exports = {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    likeNews,
    dislikeNews
};