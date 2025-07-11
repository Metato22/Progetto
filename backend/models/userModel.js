const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Il nome è obbligatorio"],
        trim: true
    },

    surname: {
        type: String,
        required: [true, "Il cognome è obbligatorio"],
        trim: true
    },

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
        match: [/\S+@\S+\.\S+/, "L'email non è valida"]
    },

    password: {
        type: String,
        minlength: [8, "La password deve essere di almeno 8 caratteri"],
        validate: {
            validator: function(v) {
                if (!v) return true;
                return /[a-z]/.test(v) &&
                    /[A-Z]/.test(v) &&
                    /\d/.test(v) &&
                    /[!@#$%^&*(),.?":{}|<>]/.test(v);
            },
            message: "La password deve contenere almeno una lettera minuscola, una maiuscola, un numero e un carattere speciale."
        }
    },

    googleId: {
        type: String
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    planLevel: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free'
    },

    subscribedCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }]

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Campo virtuale per nome completo
userSchema.virtual('fullName').get(function () {
    return `${this.name} ${this.surname}`;
});

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