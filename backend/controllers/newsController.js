const News = require('../models/News'); // Importa il modello Mongoose della notizia

// 📰 Ottiene tutte le notizie accessibili all'utente (homepage)
const getAllNews = async (req, res) => {
    const filter = {}; // Filtro per query MongoDB

    // Ottiene il livello di abbonamento dell’utente (inserito dal middleware)
    const userLevel = req.userSubscription || 'free';

    // Se specificata una categoria nella query string, aggiungila al filtro
    if (req.query.category) {
        filter.category = req.query.category;
    }

    // Filtra le notizie in base al livello di accesso:
    // utenti premium vedono tutto, utenti free solo contenuti free
    filter.accessLevel = userLevel === 'premium' ? { $in: ['free', 'premium'] } : 'free';

    // Cerca nel database le notizie che soddisfano il filtro, ordinate per data
    const news = await News.find(filter)
        .sort({ createdAt: -1 })
        .select('title imageUrl excerpt category likes dislikes accessLevel createdAt') // restituisce solo i campi visibili in anteprima
        .lean();

    res.json(news); // Ritorna l'elenco
};

// 📄 Ottiene una notizia completa (pagina di dettaglio)
const getNewsById = async (req, res) => {
    const news = await News.findById(req.params.id)
        .populate('comments.user', 'username') // Popola il campo user nei commenti con lo username
        .populate('author', 'username')
        .lean();

    if (!news) return res.status(404).json({ message: 'Notizia non trovata' });

    // Controlla se l'utente ha accesso alla notizia in base al livello richiesto
    const userLevel = req.userSubscription || 'free';
    if (news.accessLevel === 'premium' && userLevel !== 'premium') {
        return res.status(403).json({ message: 'Contenuto riservato agli abbonati premium' });
    }

    res.json(news); // Ritorna il contenuto completo
};

// 🆕 Crea una nuova notizia (solo admin)
const createNews = async (req, res) => {
    const { title, content, category, imageUrl, accessLevel } = req.body;

    // Genera automaticamente un estratto dei primi 200 caratteri del contenuto
    const excerpt = content.slice(0, 200) + '...';

    const newNews = new News({
        title,
        content,
        excerpt,
        category,
        imageUrl,
        accessLevel: accessLevel || 'free', // default: 'free'
        author: req.userId // aggiunto dal middleware di autenticazione
    });

    await newNews.save(); // Salva nel DB

    req.io.emit('news-update', newNews); // Invia aggiornamento in tempo reale a tutti i client connessi via WebSocket

    res.status(201).json(newNews); // Risposta con notizia appena creata
};

// ✏️ Modifica una notizia esistente (solo admin)
const updateNews = async (req, res) => {
    const updated = await News.findByIdAndUpdate(req.params.id, req.body, { new: true }); // aggiorna e restituisce la nuova versione

    if (!updated) return res.status(404).json({ message: 'Notizia non trovata' });

    req.io.emit('news-update', updated); // invia aggiornamento ai client
    res.json(updated);
};

// ❌ Elimina una notizia (solo admin)
const deleteNews = async (req, res) => {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Notizia non trovata' });

    req.io.emit('news-deleted', { id: req.params.id }); // invia evento di eliminazione
    res.json({ message: 'Notizia eliminata' });
};

// 👍 Aggiunge un like alla notizia (utente loggato)
const likeNews = async (req, res) => {
    const news = await News.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 } }, // incremento del campo likes
        { new: true }
    );
    res.json({ likes: news.likes }); // ritorna il numero aggiornato di likes
};

// 👎 Aggiunge un dislike alla notizia (utente loggato)
const dislikeNews = async (req, res) => {
    const news = await News.findByIdAndUpdate(
        req.params.id,
        { $inc: { dislikes: 1 } },
        { new: true }
    );
    res.json({ dislikes: news.dislikes });
};

// 💬 Aggiunge un commento (utente loggato)
const commentNews = async (req, res) => {
    const { text } = req.body;

    const comment = {
        user: req.userId, // ID dell'utente loggato
        text,
        createdAt: new Date()
    };

    const news = await News.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: comment } }, // aggiunge il commento all'array
        { new: true }
    ).populate('comments.user', 'username'); // restituisce il commento con lo username

    res.status(201).json(news.comments); // ritorna tutti i commenti aggiornati
};

// 📦 Esportazione di tutte le funzioni per uso nel router
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