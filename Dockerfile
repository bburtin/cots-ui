# Serve production HTML with NGINX.
FROM nginx:1.25.3-alpine-slim

COPY app/build/ /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
