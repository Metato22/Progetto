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
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

newsSchema.virtual('excerpt').get(function () {
    if (!this.content) return '';
    return this.content.length > 200 ? this.content.slice(0, 200) + '...' : this.content;
});

newsSchema.index({ createdAt: -1 });
newsSchema.index({ category: 1 });

module.exports = mongoose.model('News', newsSchema);