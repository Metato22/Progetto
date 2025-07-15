# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copia package.json e installa dipendenze
COPY package*.json ./
RUN npm install

# Copia il codice
COPY . .

# Porta su cui ascolta Express
EXPOSE 3000

# Comando di avvio
CMD ["node", "index.js"]