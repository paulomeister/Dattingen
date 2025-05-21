# Dockerfile.dev
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NEXT_DISABLE_ESLINT=true
RUN npm run build

# Production stage
FROM node:18-alpine AS prod
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]