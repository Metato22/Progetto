# Backend Dockerfile
FROM node:18-alpine

# Imposta cartella di lavoro nel container
WORKDIR /app

# Copia solo package.json e installa dipendenze (fase ottimizzata)
COPY package*.json ./
RUN npm install

# Copia il resto del codice
COPY . .

# Esponi la porta 3000 (quella su cui gira il backend)
EXPOSE 3000

# Avvia l'app
CMD ["npm", "start"]