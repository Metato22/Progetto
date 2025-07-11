const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
    },

    description: String,

    slug: {
        type: String,
        unique: true,
    },

    gnewsCategory: {
        type: String,
        enum: [
            'general',
            'world',
            'nation',
            'business',
            'technology',
            'entertainment',
            'sports',
            'science',
            'health',
        ],
        required: false,
        default: 'general',
    },
}, { timestamps: true });

categorySchema.pre('save', function (next) {
    if (!this.isModified('name')) return next();

    this.slug = slugify(this.name, {
        lower: true,
        strict: true,
    });

    next();
});

module.exports = mongoose.model('Category', categorySchema);