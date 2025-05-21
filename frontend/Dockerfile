# Dockerfile.dev
FROM node:latest

WORKDIR /app

COPY package*.json ./

# Instalar dependencias de desarrollo
RUN npm install

COPY . .

# Comando por defecto para desarrollo
CMD ["npm", "run", "dev"]