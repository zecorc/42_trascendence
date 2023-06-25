# Usa l'immagine di base di Node.js
FROM node:latest

# Imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia il package.json e il package-lock.json nella directory di lavoro
COPY package*.json .

# Installa le dipendenze del progetto
RUN npm install

# Copia il resto del codice del frontend nella directory di lavoro
COPY . .

# Esegui il comando per compilare l'applicazione frontend
RUN npm run build

# Specifica il comando di avvio per l'applicazione frontend
CMD ["npm", "start"]