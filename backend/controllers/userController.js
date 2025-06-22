const User = require('../models/userModel');

// ✅ Profilo utente (senza password)
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-passwordHash');
        if (!user) return res.status(404).json({ message: 'Utente non trovato' });
        res.json(user);
    } catch (err) {
        console.error('Errore profilo utente:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
};

// ✅ Upgrade del piano di abbonamento
const upgradeSubscription = async (req, res) => {
    try {
        const { level } = req.body;
        const valid = ['free', 'premium'];

        if (!valid.includes(level)) {
            return res.status(400).json({ message: 'Livello abbonamento non valido' });
        }

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'Utente non trovato' });

        if (user.subscriptionLevel === level) {
            return res.status(200).json({ message: 'Sei già a questo livello', subscriptionLevel: level });
        }

        user.subscriptionLevel = level;
        await user.save();

        res.json({
            message: `Abbonamento aggiornato a ${level}`,
            subscriptionLevel: user.subscriptionLevel
        });
    } catch (err) {
        console.error('Errore aggiornamento abbonamento:', err.message);
        res.status(500).json({ message: 'Errore del server durante l\'upgrade' });
    }
};

module.exports = {
    getProfile,
    upgradeSubscription
};