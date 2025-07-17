# ClickNews — Web App

ClickNews è un’applicazione per la gestione e la consultazione di notizie, sviluppata con **React** per il frontend e **Node.js + Express** per il backend. Include autenticazione locale e con Google, like/dislike, commenti, e integrazione con l’API GNews.

## Struttura del progetto

```
📦 root
├── frontend/          # React App (client)
├── backend/           # Express + MongoDB (API server)
├── kubernetes/        # File YAML per Kubernetes (deployment, services, ingress)
├── docker-compose.yml # Opzionale, se usato
```

---

## Avvio in locale (senza Docker)

### 1️⃣ Prerequisiti
- Node.js v18+ e npm installati
- MongoDB Atlas (o MongoDB locale)
- File `.env` configurato nel backend

### 2️⃣ Avvio backend
```bash
cd backend
npm install
node index.js
```

Server avviato su `http://localhost:3000`

### 3️⃣ Avvio frontend
```bash
cd frontend
npm install
npm start
```

App avviata su `http://localhost:5001`

> Assicurati che il file `frontend/.env` punti a `http://localhost:3000`:
```
REACT_APP_API_BASE_URL=http://localhost:3000/api
```

---

## 🐳 Avvio in locale con Docker e Kubernetes

### 1️⃣ Prerequisiti
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) **con Kubernetes abilitato**
- Repository già clonata in locale
- I file YAML si trovano nella cartella `kubernetes/`

### 2️⃣ Build delle immagini
Dalla root del progetto:
```bash
docker build -t backend:latest ./backend
docker build -t frontend:latest ./frontend
```

### 3️⃣ Avvio dei servizi con Kubernetes
Applica tutti i file:
```bash
kubectl apply -f kubernetes/
```

### 4️⃣ Configura Ingress
Assicurati che Ingress sia attivo su Docker Desktop. Aggiungi nel file `hosts` (Windows: `C:\Windows\System32\drivers\etc\hosts`) la riga:

```
127.0.0.1 clicknews.local
```

Poi apri il browser su:

```
http://clicknews.local
```

---

## Deploy pubblico con Render

> Il sito sarà disponibile pubblicamente all’indirizzo fornito da Render
> URL frontend: `https://clicknews-frontend.onrender.com`
> URL backend: `https://clicknews-backend.onrender.com`

---

## Licenza

Progetto didattico per il corso *Fondamenti Web*.
