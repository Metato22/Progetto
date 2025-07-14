# 📦 WebApp Notizie – Docker & Deployment

Questa guida mostra come avviare l’intera applicazione (frontend + backend + MongoDB) usando Docker e come fare il deploy.

## 🚀 Avvio in locale con Docker

1. Struttura del progetto:
```
root/
├── backend/           # codice Express
│   └── Dockerfile
├── frontend/          # codice React
│   └── Dockerfile
├── docker-compose.yml
```

2. Comandi:
```bash
docker-compose build
docker-compose up
```

3. Accessi:
- Frontend React: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: in container (porta 27017)

---

## ☁️ Deploy Backend su Render

1. Crea nuovo Web Service da repo Git
2. Imposta:
   - Start command: `npm start`
   - Build command: `npm install`
   - Node version: `18`
3. Aggiungi variabile `MONGO_URI` con una connessione Mongo Atlas o database Render

---

## ☁️ Deploy Frontend su Vercel

1. Pusha la cartella `frontend/` su GitHub
2. Connetti a Vercel
3. Build command: `npm run build`
4. Output dir: `build`

---

## 📎 Note
- Usa `.env` per gestire variabili sensibili
- Adatta i percorsi di `axiosInstance.js` se domini cambiano in produzione