# 📦 WebApp Notizie – Docker & Deployment (con MongoDB Atlas)

Questa guida mostra come avviare l’intera applicazione usando Docker e come fare il deploy in produzione.

---

## 🚀 Avvio in locale con Docker + MongoDB Atlas

### 1. Struttura del progetto:
```
root/
├── backend/
│   └── Dockerfile
├── frontend/
│   └── Dockerfile
├── docker-compose.yml         (quello per MongoDB Atlas)
```

### 2. Comandi:
```bash
docker-compose -f docker-compose.mongo-atlas.yml build
docker-compose -f docker-compose.mongo-atlas.yml up
```

### 3. Accessi:
- Frontend: http://localhost:5001
- Backend: http://localhost:3000
- MongoDB: gestito da Atlas (nessun container locale)

---

## ☁️ Deploy Backend su Render

1. Carica il backend su GitHub (cartella `/backend`)
2. Su Render, crea nuovo Web Service da quella repo
3. Imposta variabili ambientali:
   - `DB_CONNECTION_STRING` (URL Atlas)
   - `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, ecc.
4. Start command: `npm start`
5. Build command: `npm install`
6. Porta: `3000`

---

## ☁️ Deploy Frontend su Vercel

1. Carica la cartella `/frontend` su GitHub
2. Connetti Vercel a quella repo
3. Build command: `npm run build`
4. Output directory: `build`
5. Modifica `REACT_APP_API_BASE_URL` in `.env.production` se necessario

---

## 🛠️ Note tecniche

- Il backend si connette a MongoDB Atlas tramite `DB_CONNECTION_STRING`
- Axios nel frontend deve puntare a `/api`
- Docker esporrà:
  - React su `localhost:5001`
  - API su `localhost:3000/api`