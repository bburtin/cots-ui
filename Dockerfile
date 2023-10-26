# Use Node to build the production HTML.
FROM node:18.18.2-alpine AS build-stage

WORKDIR /app

# Install dependencies.
COPY app/package*.json /app/
RUN npm install

# Copy the COTS app.
COPY app/public/ /app/public/
COPY app/src/ /app/src/
COPY app/tsconfig.json /app/tsconfig.json

# Run tests and build production HTML.
RUN npm test -- --watchAll=false
RUN npm run build

# Serve production HTML with NGINX.
FROM nginx:1.25.3-alpine-slim

COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
