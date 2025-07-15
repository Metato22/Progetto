const News = require('../models/newsModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');

// Ottiene tutte le notizie accessibili all'utente
const getAllNews = async (req, res) => {
    try {
        const filter = {};

        if (req.query.category) {
            const category = await Category.findOne({ slug: req.query.category });
            if (!category) {
                return res.status(404).json({ message: 'Categoria non trovata' });
            }
            filter.category = category._id;
        }

        if (req.query.region) {
            if (!['Italia', 'Mondo'].includes(req.query.region)) {
                return res.status(400).json({ message: 'Regione non valida' });
            }
            filter.region = req.query.region;
        }

        const news = await News.find(filter)
            .sort({ updatedAt: -1 })
            .populate('category', 'name')
            .populate('author')
            .lean({ virtuals: true });

        const newsWithCounts = news.map(n => ({
            ...n,
            likes: n.likedBy?.length || 0,
            dislikes: n.dislikedBy?.length || 0
        }));

        res.json(newsWithCounts);
    } catch (err) {
        console.error("Errore nel caricamento delle notizie:", err.message);
        res.status(500).json({ message: "Errore interno del server" });
    }
};

// Ottieni una singola notizia completa
const getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
            .populate('author')
            .populate('category', 'name')
            .lean({ virtuals: true });

        if (!news) return res.status(404).json({ message: 'Notizia non trovata' });

        const userLevel = req.planLevel || 'free';
        if (news.accessLevel === 'premium' && userLevel !== 'premium') {
            return res.status(403).json({ message: 'Contenuto riservato agli abbonati premium' });
        }

        res.json({
            ...news,
            likes: news.likedBy?.length || 0,
            dislikes: news.dislikedBy?.length || 0,
            reactions: {
                likes: news.likedBy.map(u => u.toString()),
                dislikes: news.dislikedBy.map(u => u.toString())
            }
        });
    } catch (err) {
        console.error("Errore nel recupero della notizia:", err.message);
        res.status(500).json({ message: "Errore del server" });
    }
};

// Ottieni notizie personalizzate in base alle categorie sottoscritte
const getPersonalizedNews = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('subscribedCategories planLevel');
        if (!user) return res.status(404).json({ message: 'Utente non trovato' });

        const subscribedCategories = user.subscribedCategories || [];

        if (subscribedCategories.length === 0) {
            return res.status(200).json([]);
        }

        const news = await News.find({
            category: { $in: subscribedCategories }
        })
            .sort({ updatedAt: -1 })
            .populate('category', 'name')
            .populate('author')
            .lean({ virtuals: true });

        const newsWithCounts = news.map(n => ({
            ...n,
            likes: n.likes?.length || 0,
            dislikes: n.dislikes?.length || 0
        }));

        res.json(newsWithCounts);
    } catch (err) {
        console.error('Errore fetch notizie personalizzate:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
};

// Crea una nuova notizia (solo admin)
const createNews = async (req, res) => {
    try {
        const { title, content, category, imageUrl, accessLevel } = req.body;
        const validCategory = await Category.findById(category);
        if (!validCategory) return res.status(400).json({ message: 'Categoria non valida' });

        const excerpt = content.slice(0, 200) + '...';

        const newNews = new News({
            title,
            content,
            excerpt,
            category: validCategory._id,
            imageUrl,
            accessLevel: accessLevel || 'free',
            author: req.userId
        });

        await newNews.save();

        if (req.io) req.io.emit('news-update', newNews);

        res.status(201).json(newNews);
    } catch (err) {
        console.error('Errore creazione notizia:', err.message);
        res.status(500).json({ message: 'Errore durante la creazione della notizia' });
    }
};

// Modifica notizia (solo admin)
const updateNews = async (req, res) => {
    try {
        const forbiddenFields = ['author', 'likes', 'dislikes', 'comments'];
        forbiddenFields.forEach(field => delete req.body[field]);

        const updated = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Notizia non trovata' });

        if (req.io) req.io.emit('news-update', updated);
        res.json(updated);
    } catch (err) {
        console.error('Errore aggiornamento notizia:', err.message);
        res.status(500).json({ message: 'Errore durante l\'aggiornamento' });
    }
};

// Elimina notizia (solo admin)
const deleteNews = async (req, res) => {
    try {
        const deleted = await News.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Notizia non trovata' });

        if (req.io) req.io.emit('news-deleted', { id: req.params.id });
        res.json({ message: 'Notizia eliminata' });
    } catch (err) {
        console.error('Errore eliminazione notizia:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
};

// Aggiunge un like
const toggleLike = async (req, res) => {
    try {
        const userId = req.userId;
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: 'Notizia non trovata' });

        const hasLiked = news.likedBy.includes(userId);
        const hasDisliked = news.dislikedBy.includes(userId);

        if (hasLiked) {
            // Rimuovi like
            news.likedBy.pull(userId);
        } else {
            // Aggiungi like
            news.likedBy.push(userId);
            if (hasDisliked) {
                // Rimuovi dislike se presente
                news.dislikedBy.pull(userId);
            }
        }

        await news.save();
        res.json({
            likes: news.likedBy.length,
            dislikes: news.dislikedBy.length,
            reactions: {
                likes: news.likedBy.map(u => u.toString()),
                dislikes: news.dislikedBy.map(u => u.toString())
            }
        });
    } catch (err) {
        console.error("Errore toggle like:", err.message);
        res.status(500).json({ message: "Errore del server" });
    }
};

// Aggiunge un dislike
const toggleDislike = async (req, res) => {
    try {
        const userId = req.userId;
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: 'Notizia non trovata' });

        const hasLiked = news.likedBy.includes(userId);
        const hasDisliked = news.dislikedBy.includes(userId);

        if (hasDisliked) {
            // Rimuovi dislike
            news.dislikedBy.pull(userId);
        } else {
            // Aggiungi dislike
            news.dislikedBy.push(userId);
            if (hasLiked) {
                // Rimuovi like se presente
                news.likedBy.pull(userId);
            }
        }

        await news.save();
        res.json({
            likes: news.likedBy.length,
            dislikes: news.dislikedBy.length,
            reactions: {
                likes: news.likedBy.map(u => u.toString()),
                dislikes: news.dislikedBy.map(u => u.toString())
            }
        });
    } catch (err) {
        console.error("Errore toggle dislike:", err.message);
        res.status(500).json({ message: "Errore del server" });
    }
};

module.exports = {
    getAllNews,
    getNewsById,
    getPersonalizedNews,
    createNews,
    updateNews,
    deleteNews,
    toggleLike,
    toggleDislike
};