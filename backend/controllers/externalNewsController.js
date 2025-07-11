const axios = require('axios');
const NodeCache = require('node-cache');
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const User = require('../models/userModel');

const newsCache = new NodeCache({ stdTTL: 3600 }); // cache TTL 1 ora

const getExternalNews = async (req, res) => {
    try {
        const gnewsCountry = req.query.gnewsCountry;  // non assegniamo default qui
        const gnewsCategory = req.query.gnewsCategory || 'general';

        const cacheKey = `externalNews_${gnewsCountry || 'all'}_${gnewsCategory}`;
        const cachedArticles = newsCache.get(cacheKey);
        if (cachedArticles) {
            return res.json(cachedArticles);
        }

        // Costruisci URL in base alla presenza di gnewsCountry
        let url = `https://gnews.io/api/v4/top-headlines?lang=it&category=${gnewsCategory}`;
        if (gnewsCountry) {
            url += `&country=${gnewsCountry}`;
        }
        url += `&token=${GNEWS_API_KEY}`;

        const response = await axios.get(url);
        const articles = response.data.articles || [];

        // Filtra duplicati per titolo
        const seenTitles = new Set();
        const filteredArticles = articles.filter(article => {
            if (seenTitles.has(article.title)) return false;
            seenTitles.add(article.title);
            return true;
        });

        // Ordina per data più recente
        filteredArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        newsCache.set(cacheKey, filteredArticles);

        res.json(filteredArticles);
    } catch (error) {
        console.error("Errore fetch notizie esterne:", error.message);
        res.status(500).json({ message: "Errore fetch notizie esterne" });
    }
};

const getPersonalizedExternalNews = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('subscribedCategories');
        if (!user || user.subscribedCategories.length === 0) {
            return res.status(200).json([]); // Nessuna categoria sottoscritta
        }

        // Ottieni le gnewsCategory associate alle categorie sottoscritte
        const gnewsCategories = user.subscribedCategories
            .map(cat => cat.gnewsCategory)
            .filter(Boolean);

        const uniqueCategories = [...new Set(gnewsCategories)];

        // Usa una chiave cache unica per queste categorie ordinate (così se cambia ordine, cache diversa)
        const cacheKey = `personalizedNews_${uniqueCategories.sort().join('_')}`;
        const cachedArticles = newsCache.get(cacheKey);
        if (cachedArticles) {
            return res.json(cachedArticles);
        }

        const allArticles = [];

        // Richiesta per ogni categoria
        for (const category of uniqueCategories) {
            const url = `https://gnews.io/api/v4/top-headlines?lang=it&category=${category}&token=${GNEWS_API_KEY}`;
            const response = await axios.get(url);
            const articles = response.data.articles || [];
            allArticles.push(...articles);
        }

        // Rimuovi duplicati per titolo
        const seenTitles = new Set();
        const filtered = allArticles.filter(article => {
            if (seenTitles.has(article.title)) return false;
            seenTitles.add(article.title);
            return true;
        });

        // Ordina per data
        filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        newsCache.set(cacheKey, filtered);

        res.json(filtered);
    } catch (error) {
        console.error('Errore nel recupero delle notizie personalizzate:', error.message);
        res.status(500).json({ message: 'Errore server nel recupero delle notizie esterne personalizzate' });
    }
};

module.exports = {
    getExternalNews,
    getPersonalizedExternalNews
};