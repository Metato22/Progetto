const jwt = require('jsonwebtoken');

// Middleware per verificare il JWT da header *o* cookie
const verifyAccessToken = (req, res, next) => {
    // 1. Prima cerca in Authorization header
    let token = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    // 2. Se non trovato, prova dal cookie
    if (!token && req.cookies?.access_token) {
        token = req.cookies.access_token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Non autorizzato: Token mancante' });
    }

    // 3. Verifica JWT
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error('Errore verifica JWT:', err.name, err.message);
            return res.status(403).json({ message: 'Proibito: Token non valido o scaduto' });
        }

        req.userId = decoded.userId;
        req.userRole = decoded.role;
        req.planLevel = decoded.planLevel || 'free';
        next();
    });
};

// Middleware per verificare un ruolo specifico (se necessario)
const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole || !allowedRoles.includes(req.userRole)) {
            return res.status(403).json({ message: 'Proibito: Ruolo non sufficiente' });
        }
        next();
    };
};

module.exports = { verifyAccessToken, verifyRole };