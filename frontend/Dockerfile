# frontend/Dockerfile
# Build stage (instala dependências, compila TS, etc.)
FROM node:22-alpine AS build-frontend

WORKDIR /app

COPY . ./
# Installing Dependencies
RUN npm install -g npm@latest && npm install --omit=dev && npm prune

EXPOSE 3000

# CMD specifies the default command to run when the container starts.
# This runs the 'dev' script from package.json using npm.
# The '--' passes '--host 0.0.0.0' to the dev server, making it accessible externally.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]