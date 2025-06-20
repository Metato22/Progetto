const Category = require('../models/Category');

const getCategories = async (req, res) => {
    const cats = await Category.find();
    res.json(cats);
};

const createCategory = async (req, res) => {
    const { name, description } = req.body;
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Categoria già esistente' });
    const cat = new Category({ name, description });
    await cat.save();
    res.status(201).json(cat);
};

module.exports = { getCategories, createCategory };