// Importa la strategia Google OAuth2 fornita da Passport
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Importa il modello utente dal database MongoDB
const User = require('../models/userModel');

// Funzione di utilità per generare uno username basato sull'email
const generateUsernameFromEmail = (email) => {
    const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ''); // Rimuove simboli
    const random = Math.floor(1000 + Math.random() * 9000); // Aggiunge 4 cifre casuali
    return `${base}${random}`;
};

// Esporta una funzione che configura Passport
module.exports = (passport) => {
    // Configura la strategia di autenticazione Google
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback'
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleId = profile.id;
                const email = profile.emails?.[0]?.value;

                // Se manca l'email (improbabile ma possibile)
                if (!email) {
                    return done(new Error('Email non disponibile da Google'), null);
                }

                // Cerca utente esistente con stesso Google ID
                let user = await User.findOne({ googleId });

                if (!user) {
                    // Assegna ruolo: admin se dominio è @studenti.poliba.it o email è specifica
                    const isAdmin = email.endsWith('@studenti.poliba.it') || email === 'admin@news.it';

                    // Crea nuovo utente con username generato automaticamente
                    user = await User.create({
                        googleId,
                        email,
                        username: generateUsernameFromEmail(email),
                        role: isAdmin ? 'admin' : 'user',
                        subscriptionLevel: 'free'
                    });

                    console.log(`🆕 Nuovo utente creato via Google: ${user.username} (${user.role})`);
                }

                // Passa l'utente a Passport
                return done(null, user);
            } catch (err) {
                console.error('Errore durante il login con Google:', err);
                return done(err, null);
            }
        }
    ));

    // Salva solo l'ID nella sessione temporanea (richiesto per Google OAuth)
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // Recupera l'utente completo dal DB tramite ID
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};