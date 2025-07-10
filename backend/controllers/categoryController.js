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

// ✅ Ottieni una categoria per slug
const getCategoryBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const category = await Category.findOne({ slug: slug });

        if (!category) {
            return res.status(404).json({ message: 'Categoria non trovata' });
        }

        res.status(200).json(category);
    } catch (err) {
        console.error('Errore nel recuperare la categoria:', err.message);
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

// ✅ Aggiorna una categoria (solo admin)
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (name) {
            const exists = await Category.findOne({ name, _id: { $ne: req.params.id } });
            if (exists) return res.status(400).json({ message: 'Categoria con questo nome già esistente' });
        }

        const updated = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ message: 'Categoria non trovata' });
        res.json(updated);
    } catch (err) {
        console.error('Errore aggiornamento categoria:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
};

// ✅ Elimina una categoria (solo admin)
const deleteCategory = async (req, res) => {
    try {
        const deleted = await Category.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Categoria non trovata' });

        res.json({ message: 'Categoria eliminata con successo' });
    } catch (err) {
        console.error('Errore eliminazione categoria:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
};

module.exports = {
    getCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
};