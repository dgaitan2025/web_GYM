# --- Build ---
FROM node:18-bullseye-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build   # Vite genera /dist

# --- Run ---
FROM node:18-bullseye-slim
WORKDIR /app
RUN npm i -g serve
# Copiamos /dist del builder a /app/build para servirlo
COPY --from=builder /app/dist ./build
ENV PORT=3000
EXPOSE 3000
CMD ["sh","-c","serve -s build -l ${PORT}"]

