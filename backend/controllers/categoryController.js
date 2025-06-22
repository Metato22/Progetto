const Category = require('../models/categoryModel');

// ✅ Ottieni tutte le categorie
const getCategories = async (req, res) => {
    try {
        const cats = await Category.find();
        res.json(cats);
    } catch (err) {
        console.error('Errore caricamento categorie:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
};

// ✅ Crea una nuova categoria (solo admin)
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: 'Nome categoria obbligatorio' });

        const exists = await Category.findOne({ name });
        if (exists) return res.status(400).json({ message: 'Categoria già esistente' });

        const cat = new Category({ name, description });
        await cat.save();

        res.status(201).json(cat);
    } catch (err) {
        console.error('Errore creazione categoria:', err.message);
        res.status(500).json({ message: 'Errore durante la creazione della categoria' });
    }
};

module.exports = { getCategories, createCategory };