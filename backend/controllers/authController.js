// Import dei moduli necessari
const User = require('../models/userModel');
const RefreshToken = require('../models/refreshTokenModel');
const jwt = require('jsonwebtoken');

// ✅ Funzione helper per generare access e refresh token coerenti con login Google
const generateTokens = (user) => {
    const payload = {
        userId: user._id,
        role: user.role,
        planLevel: user.planLevel
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
};

// ✅ Registrazione utente locale
exports.registerUser = async (req, res) => {
    try {
        const { name, surname, username, email, password, googleId } = req.body;

        // Controllo obbligatorietà password se non è registrazione Google
        if (!password && !googleId) {
            return res.status(400).json({ message: "La password è obbligatoria per la registrazione classica." });
        }

        // Verifica se username o email sono già usati
        if (await User.findOne({ username })) {
            return res.status(400).json({ message: "Username già in uso." });
        }
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "Email già in uso." });
        }

        // Crea nuovo utente (la password verrà hashata dal pre-save)
        const newUser = new User({ name, surname, username, email, password });

        // Se è registrazione Google
        if (googleId) {
            newUser.googleId = googleId;
        }

        // 👉 Assegna ruolo admin se l'email finisce con @clicknews.it
        if (email.endsWith('@clicknews.it')) {
            newUser.role = 'admin';
        }

        await newUser.save();

        res.status(201).json({ message: "Utente registrato con successo!", userId: newUser._id });
    } catch (error) {
        console.error("Errore registrazione:", error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join('. ') });
        }

        // Duplicato (controllo in più, a volte mongoose manda errore diverso)
        if (error.code && error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} già in uso.` });
        }

        res.status(500).json({ message: "Errore del server durante la registrazione." });
    }
};

// ✅ Login utente classico
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email e password sono obbligatori." });
        }

        // Usa email lowercase per sicurezza
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: "Credenziali non valide." });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Credenziali non valide." });
        }

        // ✅ Genera access + refresh token con ruolo e abbonamento
        const { accessToken, refreshToken } = generateTokens(user);

        // Salva il refresh token nel DB
        await RefreshToken.create({ token: refreshToken, userId: user._id });

        // Invia refresh token come cookie httpOnly
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Risposta con access token + info utente
        res.json({
            message: "Login effettuato con successo!",
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                planLevel: user.planLevel
            }
        });
    } catch (error) {
        console.error("Errore login:", error);
        res.status(500).json({ message: "Errore del server durante il login." });
    }
};

// ✅ Refresh del token di accesso tramite cookie httpOnly
exports.refreshToken = async (req, res) => {
    const cookies = req.cookies;
    const refreshTokenFromCookie = cookies?.jwt;

    if (!refreshTokenFromCookie) {
        return res.status(401).json({ message: "Non autorizzato: Refresh token mancante." });
    }

    const foundToken = await RefreshToken.findOne({ token: refreshTokenFromCookie });
    if (!foundToken) {
        return res.status(403).json({ message: "Proibito: Refresh token non valido o scaduto." });
    }

    try {
        // Verifica validità del refresh token
        jwt.verify(refreshTokenFromCookie, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err || foundToken.userId.toString() !== decoded.userId) {
                return res.status(403).json({ message: "Proibito: Refresh token non valido." });
            }

            // ✅ Recupera utente per rigenerare access token completo
            const user = await User.findById(decoded.userId);
            if (!user) return res.status(404).json({ message: "Utente non trovato." });

            const newAccessToken = jwt.sign({
                userId: user._id,
                role: user.role,
                planLevel: user.planLevel
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error("Errore refresh token:", error);
        res.status(500).json({ message: "Errore del server durante il refresh del token." });
    }
};

// ✅ Logout: elimina il refresh token e il cookie
exports.logoutUser = async (req, res) => {
    const cookies = req.cookies;
    const refreshTokenFromCookie = cookies?.jwt;

    if (!refreshTokenFromCookie) {
        return res.sendStatus(204); // Nessun contenuto, nessun token
    }

    try {
        // Elimina il token dal DB
        await RefreshToken.deleteOne({ token: refreshTokenFromCookie });

        // Pulisci il cookie
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        res.status(200).json({ message: "Logout effettuato con successo." });
    } catch (error) {
        console.error("Errore logout:", error);
        res.status(500).json({ message: "Errore del server durante il logout." });
    }
};

// ✅ Login tramite Google (dopo successo Passport)
exports.handleGoogleLogin = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Utente non autenticato tramite Google." });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        // Salva il refresh token nel DB
        await RefreshToken.create({ token: refreshToken, userId: user._id });

        // Invia refresh token come cookie httpOnly
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // 🔥 cambio fondamentale
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Invia anche access token come cookie httpOnly (opzionale)
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // meglio coerenza
            maxAge: 15 * 60 * 1000
        });

        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5001';
        res.redirect(`${FRONTEND_URL}/auth/google/success`);
    } catch (error) {
        console.error("Errore login Google:", error);
        res.status(500).json({ message: "Errore del server durante il login con Google." });
    }
};