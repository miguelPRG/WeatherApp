# backend/Dockerfile
# Build stage (instala dependências, compila TS, etc.)
FROM node:22-alpine AS build-backend

WORKDIR /app

COPY . ./

# Installing Dependencies
RUN npm install -g npm@latest && npm install --omit=dev && npm prune

ENV NODE_ENV=production

EXPOSE 8000

CMD ["npm", "run", "server"]