// Importa la strategia Google OAuth2 fornita da Passport
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Importa il modello utente dal database MongoDB
const User = require('../models/User');

// Esporta una funzione che configura Passport
module.exports = (passport) => {
    // Configura la strategia di autenticazione "google"
    passport.use(new GoogleStrategy(
        {
            // ✅ Questi dati li ottieni da Google Cloud Console (OAuth credentials)
            clientID: process.env.GOOGLE_CLIENT_ID,         // ID cliente Google
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Secret Google
            callbackURL: '/api/auth/google/callback'        // Dove Google reindirizza dopo login
        },

        // Questa è la funzione che viene chiamata dopo che l'utente si autentica con Google
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Cerca nel DB un utente già registrato con googleId
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    // Se non esiste, crea un nuovo utente usando i dati del profilo Google

                    // Assegna ruolo in base all'email (admin se dominio specifico)
                    const email = profile.emails[0].value;
                    const isAdmin = email.endsWith('@studenti.poliba.it') || email === 'admin@news.it';

                    user = await User.create({
                        googleId: profile.id,
                        username: profile.displayName,
                        email,
                        role: isAdmin ? 'admin' : 'user', // 👈 qui assegni dinamicamente
                        subscriptionLevel: 'free'
                    });

                }

                // Passa l'utente a Passport (login completato)
                return done(null, user);
            } catch (err) {
                // In caso di errore durante la ricerca/creazione
                return done(err, null);
            }
        }
    ));

    // 🔐 Serializza l’utente nella sessione (serve solo durante il redirect Google → server)
    passport.serializeUser((user, done) => {
        // Salva solo l'ID nella sessione
        done(null, user._id);
    });

    // 🔓 Deserializza: prende l'ID salvato nella sessione e recupera l'oggetto utente completo
    passport.deserializeUser(async (id, done) => {
        try {
            // Cerca l'utente nel DB tramite ID
            const user = await User.findById(id);
            // Passa l'utente a Passport
            done(null, user);
        } catch (err) {
            done(err, null); // In caso di errore
        }
    });
};