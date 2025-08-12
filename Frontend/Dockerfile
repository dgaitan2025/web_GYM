# --- Build ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Run ---
FROM node:18-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=builder /app/build ./build
# Render te expone $PORT; si no, usa 3000 por defecto.
ENV PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "serve -s build -l ${PORT}"]
