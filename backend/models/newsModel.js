const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    region: {
        type: String,
        enum: ['Italia', 'Mondo'],
        default: 'Mondo'
    },

    accessLevel: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free'
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    likes: {
        type: Number,
        default: 0,
        min: 0
    },

    dislikes: {
        type: Number,
        default: 0,
        min: 0
    }

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Aggiungi campo virtuale "excerpt"
newsSchema.virtual('excerpt').get(function () {
    if (!this.content) return '';
    return this.content.length > 200 ? this.content.slice(0, 200) + '...' : this.content;
});

// Indici
newsSchema.index({ createdAt: -1 });
newsSchema.index({ category: 1 });

module.exports = mongoose.model('News', newsSchema);