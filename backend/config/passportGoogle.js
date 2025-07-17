const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

const generateUsernameFromEmail = (email) => {
    const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${base}${random}`;
};

module.exports = (passport) => {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback' || process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleId = profile.id;
                const email = profile.emails?.[0]?.value;

                if (!email) {
                    return done(new Error('Email non disponibile da Google'), null);
                }

                // Provo a trovare utente con googleId
                let user = await User.findOne({ googleId });

                if (!user) {
                    // Cerco utente esistente con la stessa email (registrato senza Google)
                    user = await User.findOne({ email });

                    if (user) {
                        // Se esiste, assegno googleId e salvo
                        user.googleId = googleId;
                        await user.save();
                    } else {

                        const name = profile.name?.givenName?.trim();
                        const surname = profile.name?.familyName?.trim();

                        user = await User.create({
                            name: name || 'GoogleUser',
                            surname: surname || '',
                            username: generateUsernameFromEmail(email),
                            email,
                            googleId,
                            role: 'user',
                            planLevel: 'free'
                        });
                    }
                }

                return done(null, user);
            } catch (err) {
                console.error('Errore durante il login con Google:', err);
                return done(err, null);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};