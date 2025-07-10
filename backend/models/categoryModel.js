const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    slug: {
        type: String,
        unique: true
    }
}, { timestamps: true });

categorySchema.pre('save', function(next) {
    if (!this.isModified('name')) return next();

    this.slug = slugify(this.name, {
        lower: true,
        strict: true
    });

    next();
});

module.exports = mongoose.model('Category', categorySchema);