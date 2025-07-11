const express = require('express');
const router = express.Router();

// Importa i controller classici
const authController = require('../controllers/authController');

// Importa Passport e configura Google OAuth
const passport = require('passport');
require('../config/passportGoogle')(passport); // 👈 importa la strategia Google

// Per generare il tuo JWT personalizzato
const jwt = require('jsonwebtoken');

// ========================
// LOGIN CLASSICO
// ========================

// ✅ Registrazione con email/password
router.post('/register', authController.registerUser);

// ✅ Login classico (ritorna JWT)
router.post('/login', authController.loginUser);

// ✅ Rinnovo del token di accesso (con refresh token)
router.post('/refresh', authController.refreshToken);

// ✅ Logout
router.post('/logout', authController.logoutUser);

// ========================
// LOGIN CON GOOGLE
// ========================

// 🔁 Inizia il login con Google (redirect a Google)
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 🔁 Callback dopo autenticazione Google
router.get('/google/callback',
    passport.authenticate('google', {
        session: false,               // non usiamo sessioni permanenti
        failureRedirect: '/login'     // se fallisce, redirect a /login (o pagina frontend)
    }),
    (req, res) => {
        // ✅ Genera il tuo JWT interno dopo che Google ha autenticato
        const token = jwt.sign(
            {
                userId: req.user._id,
                role: req.user.role,
                planLevel: req.user.planLevel
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        // 🔁 Reindirizza al frontend React passando il token come parametro URL
        res.redirect(`http://localhost:3000/auth/google/success?token=${token}`);
    }
);

module.exports = router;