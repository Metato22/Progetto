const User = require('../models/userModel');

// ✅ Profilo utente (senza password)
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'Utente non trovato' });
        res.json(user);
    } catch (err) {
        console.error('Errore profilo utente:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
};

// ✅ Upgrade del piano di abbonamento
const upgradePlan = async (req, res) => {
    try {
        const { level } = req.body;
        const valid = ['free', 'premium'];

        if (!valid.includes(level)) {
            return res.status(400).json({ message: 'Livello abbonamento non valido' });
        }

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'Utente non trovato' });

        if (user.planLevel === level) {
            return res.status(200).json({ message: 'Sei già a questo livello', planLevel: level });
        }

        user.planLevel = level;
        await user.save();

        res.json({
            message: `Abbonamento aggiornato a ${level}`,
            user
        });
    } catch (err) {
        console.error('Errore aggiornamento abbonamento:', err.message);
        res.status(500).json({ message: 'Errore del server durante l\'upgrade' });
    }
};

// ✅ Sottoscrizione a una categoria
const subscribe = async (req, res) => {
    console.log('Subscribe endpoint called');
    console.log('UserId:', req.userId);
    console.log('Request body:', req.body);

    try {
        const userId = req.userId;
        const { categoryId } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Utente non autenticato' });
        }

        if (!categoryId) {
            return res.status(400).json({ message: 'categoryId richiesto' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        if (!Array.isArray(user.subscribedCategories)) {
            user.subscribedCategories = [];
        }

        if (!user.subscribedCategories.includes(categoryId)) {
            user.subscribedCategories.push(categoryId);
            await user.save();
        }

        // 🔔 Emit al frontend (notifica aggiornamento)
        if (req.io) {
            req.io.emit('subscription-updated', {
                userId,
                categoryId,
                action: 'subscribe'
            });
        }

        res.status(200).json({
            message: 'Categoria sottoscritta con successo',
            subscribedCategories: user.subscribedCategories
        });
    } catch (err) {
        console.error('Errore nella sottoscrizione:', err);
        res.status(500).json({ message: 'Errore nella sottoscrizione', error: err.message });
    }
};

// ✅ Recupero sottoscrizioni
const getSubscriptions = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('subscribedCategories');
        res.status(200).json(user.subscribedCategories);
    } catch (err) {
        res.status(500).json({ message: 'Errore nel recupero delle sottoscrizioni', error: err.message });
    }
};

// ✅ Rimozione sottoscrizione
const unsubscribe = async (req, res) => {
    try {
        const { categoryId } = req.body;
        const user = await User.findById(req.userId);

        user.subscribedCategories = user.subscribedCategories.filter(
            id => id.toString() !== categoryId
        );
        await user.save();

        // 🔔 Emit al frontend (notifica aggiornamento)
        if (req.io) {
            req.io.emit('subscription-updated', {
                userId: req.userId,
                categoryId,
                action: 'unsubscribe'
            });
        }

        res.status(200).json({
            message: 'Sottoscrizione rimossa',
            subscribedCategories: user.subscribedCategories
        });
    } catch (err) {
        res.status(500).json({ message: 'Errore nella rimozione', error: err.message });
    }
};

// ✅ Completamento profilo
const completeProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, surname } = req.body;

        if (!name || !surname) {
            return res.status(400).json({ message: "Nome e cognome sono obbligatori." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato." });
        }

        if (user.name && user.surname) {
            return res.status(400).json({ message: "Profilo già completo." });
        }

        user.name = name;
        user.surname = surname;
        await user.save();

        res.status(200).json({ message: "Profilo aggiornato con successo.", user });
    } catch (err) {
        console.error("Errore completamento profilo:", err);
        res.status(500).json({ message: "Errore server durante il completamento del profilo." });
    }
};

module.exports = {
    getProfile,
    upgradePlan,
    subscribe,
    getSubscriptions,
    unsubscribe,
    completeProfile
};