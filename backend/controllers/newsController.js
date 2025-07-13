const News = require('../models/newsModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel'); // necessario per getPersonalizedNews

// 📰 Ottiene tutte le notizie accessibili all'utente (senza filtro su accessLevel)
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

        // Rimosso filtro accessLevel per mostrare tutte le notizie

        const news = await News.find(filter)
            .sort({ updatedAt: -1 }) // ordinamento coerente per data di creazione
            .populate('category', 'name')
            .populate('author')
            .select('title content imageUrl category region likes dislikes accessLevel createdAt updatedAt author')
            .lean({ virtuals: true });

        res.json(news);
    } catch (err) {
        console.error("Errore nel caricamento delle notizie:", err.message);
        res.status(500).json({ message: "Errore interno del server" });
    }
};

// 📄 Ottieni una singola notizia completa (controllo accessLevel mantenuto)
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

        res.json(news);
    } catch (err) {
        console.error("Errore nel recupero della notizia:", err.message);
        res.status(500).json({ message: "Errore del server" });
    }
};

// 🔍 Ottieni notizie personalizzate in base alle categorie sottoscritte (senza filtro accessLevel)
const getPersonalizedNews = async (req, res) => {
    try {
        const userId = req.userId;

        // Trova l'utente e prendi le categorie sottoscritte
        const user = await User.findById(userId).select('subscribedCategories planLevel');
        if (!user) return res.status(404).json({ message: 'Utente non trovato' });

        const subscribedCategories = user.subscribedCategories || [];

        if (subscribedCategories.length === 0) {
            return res.status(200).json([]); // Nessuna categoria sottoscritta => nessuna notizia
        }

        const news = await News.find({
            category: { $in: subscribedCategories }
        })
            .sort({ updatedAt: -1 })
            .populate('category', 'name')
            .populate('author')
            .select('title content imageUrl category region likes dislikes accessLevel createdAt updatedAt author')
            .lean({ virtuals: true });

        res.json(news);
    } catch (err) {
        console.error('Errore fetch notizie personalizzate:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
};

// 🆕 Crea una nuova notizia (solo admin)
const createNews = async (req, res) => {
    try {
        const { title, content, category, imageUrl, accessLevel } = req.body;

        // Verifica categoria esistente tramite id
        const validCategory = await Category.findById(category);
        if (!validCategory) return res.status(400).json({ message: 'Categoria non valida' });

        const excerpt = content.slice(0, 200) + '...';

        const newNews = new News({
            title,
            content,
            excerpt,
            category: validCategory._id, // uso _id della categoria
            imageUrl,
            accessLevel: accessLevel || 'free',
            author: req.userId
        });

        await newNews.save();

        // Emissione evento socket
        if (req.io) req.io.emit('news-update', newNews);

        res.status(201).json(newNews);
    } catch (err) {
        console.error('Errore creazione notizia:', err.message);
        res.status(500).json({ message: 'Errore durante la creazione della notizia' });
    }
};

// ✏️ Modifica notizia (solo admin)
const updateNews = async (req, res) => {
    try {
        // Evita modifiche a campi sensibili
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

// ❌ Elimina notizia (solo admin)
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
    getPersonalizedNews,
    createNews,
    updateNews,
    deleteNews,
    likeNews,
    dislikeNews
};