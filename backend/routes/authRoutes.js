const express = require('express');
const router = express.Router();

// Importa i controller classici
const authController = require('../controllers/authController');

// Importa Passport e configura Google OAuth
const passport = require('passport');
require('../config/passportGoogle')(passport); // importa la strategia Google

// ========================
// LOGIN CLASSICO
// ========================

// Registrazione con email/password
router.post('/register', authController.registerUser);

// Login classico (ritorna JWT)
router.post('/login', authController.loginUser);

// Rinnovo del token di accesso (con refresh token)
router.post('/refresh', authController.refreshToken);

// Logout
router.post('/logout', authController.logoutUser);

// ========================
// LOGIN CON GOOGLE
// ========================

// Inizia il login con Google (redirect a Google)
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback dopo autenticazione Google
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login`
    }),
    authController.handleGoogleLogin
);

module.exports = router;