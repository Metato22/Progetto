const User = require('../models/User');
const Category = require('../models/Category');

const getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
};

const subscribeCategory = async (req, res) => {
    const { categoryId } = req.body;
    const cat = await Category.findById(categoryId);
    if (!cat) return res.status(404).json({ message: 'Categoria non trovata' });

    const user = await User.findById(req.user.id);
    if (!user.subscribedCategories.includes(categoryId)) {
        user.subscribedCategories.push(categoryId);
        await user.save();
    }
    res.json({ message: 'Iscrizione avvenuta' });
};

const getSubscriptions = async (req, res) => {
    const user = await User.findById(req.user.id).populate('subscribedCategories');
    res.json(user.subscribedCategories);
};

module.exports = { getProfile, subscribeCategory, getSubscriptions };