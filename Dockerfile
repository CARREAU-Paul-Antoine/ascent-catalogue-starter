# Étape build
FROM node:18-alpine AS build

WORKDIR /app

# Copier package.json et package-lock.json pour installer deps
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier tout le projet
COPY . .

# Exposer le port sur lequel tourne ton app
EXPOSE 4200

# Commande pour démarrer l'application
CMD ["node", "src/index.js"]
