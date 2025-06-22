const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, "L'username è obbligatorio"],
        unique: true,
        trim: true,
        lowercase: true
    },

    email: {
        type: String,
        required: [true, "L'email è obbligatoria"],
        unique: true,
        trim: true,
        lowercase: true,
        // Regex semplice per validazione email
        match: [/\S+@\S+\.\S+/, "L'email non è valida"]
    },

    password: {
        type: String,
        minlength: [8, "La password deve essere di almeno 6 caratteri"]
    }, // non obbligatoria per utenti Google

    googleId: {
        type: String // presente se l’utente si registra via Google
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    subscriptionLevel: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free'
    }

}, { timestamps: true });

// Middleware pre-save per hashare la password prima di salvarla
userSchema.pre('save', async function (next) {
    // Esegui l'hashing solo se la password è stata modificata (o è nuova)
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Metodo per confrontare la password inserita con quella hashata nel DB
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);