const User = require('../models/User');

// Recupera profilo utente incluso abbonamento
const getProfile = async (req, res) => {
    const user = await User.findById(req.userId).select('-passwordHash');
    res.json(user);
};

// Upgrade piano abbonamento
const upgradeSubscription = async (req, res) => {
    const { level } = req.body;
    const valid = ['free', 'premium'];
    if (!valid.includes(level))
        return res.status(400).json({ message: 'Livello abbonamento non valido' });

    const user = await User.findByIdAndUpdate(req.userId,
        { subscriptionLevel: level },
        { new: true }
    ).select('-passwordHash');

    res.json({ message: `Abbonamento aggiornato a ${level}`, subscriptionLevel: user.subscriptionLevel });
};

module.exports = { getProfile, upgradeSubscription };