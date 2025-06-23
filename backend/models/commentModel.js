const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    news: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'News',
        required: true
    },

    text: {
        type: String,
        required: true,
        trim: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);