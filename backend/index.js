// index.js è l'entry point per la nostra applicazione
require('dotenv').config(); // Carica le variabili d'ambiente dal file .env
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const http = require('http');
const cors = require('cors'); // Per abilitare richieste Cross-Origin
const session = require('express-session');
const passport = require('passport');
const { Server } = require('socket.io');

// Importa le strategie OAuth (Google)
require('./config/passportGoogle')(passport);

// importiamo i router per gestire le richieste di autenticazione, gestione utenti, notizie,
// consultazione notizie, gestione categorie
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
const externalNewsRoutes = require('./routes/externalNewsRoutes');

// creazione dell'app con il framework express
const app = express();
// express() ritorna un app che è una Function di JavaScript, che deve essere passata ad un server
app.set('trust proxy', 1); // Necessario per cookie "secure" dietro proxy
// Node HTTP come callback per gestire le richieste
const server = http.createServer(app);

// Configura Socket.IO con supporto a CORS per il frontend
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5001', // URL del frontend React
        credentials: true                // Necessario per cookie HTTPOnly
    }
});

// Middleware per rendere disponibile `io` in tutti i controller via `req.io`
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Log di connessione WebSocket per debug
io.on('connection', (socket) => {
    console.log(`🟢 Socket connesso: ${socket.id}`);
});

//controlliamo dal file delle variabili d'ambiente se è stata specificata una porta diversa dalla 3000
const PORT = process.env.PORT || 3000;

// Definiamo i middleware nell'ordine in cui vogliamo vengano eseguiti
app.use(cors({ // Configurazione CORS
    origin: 'http://localhost:5001', // O l'URL del tuo frontend se diverso, o true per tutti
    credentials: true // Necessario per inviare/ricevere cookie cross-origin
}));

// Middleware di sessione (richiesto da Passport per Google OAuth)
app.use(session({
    secret: process.env.SESSION_SECRET || 'unsegretocasuale',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // TRUE solo in produzione con HTTPS
        sameSite: 'lax'
    }
}));

app.use(express.json()); // Per parsare il body delle richieste JSON
app.use(express.urlencoded({extended: true})); // Per parsare il body delle richieste URL-encoded
app.use(cookieParser()); // Per parsare i cookie

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/external-news', externalNewsRoutes);

// Route di base per test
app.get('/', (req, res) => {
    res.send('Benvenuto nel backend di LiveNews!');
});

// Gestione di rotte non trovate (404)
/*app.use('*', (req, res) => {
    res.status(404).json({ message: 'Endpoint non trovato' });
});*/
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint non trovato' });
});


// Semplice gestore di errori globale
app.use((err, req, res, next) => {
    console.error("Errore nella richiesta:");
    res.status(500).send('Qualcosa è andato storto!');
});

// Connessione a MongoDB e avvio del server
mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`✅ Connesso a MongoDB. Server in ascolto su http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Errore di connessione al database:", err.message);
    });