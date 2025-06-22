const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    text: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const newsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    excerpt: {
        type: String
    },

    imageUrl: {
        type: String
    },

    category: {
        type: String,
        required: true
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
        default: 0
    },

    dislikes: {
        type: Number,
        default: 0
    },

    comments: [commentSchema],

}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);