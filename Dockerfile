FROM node:22-slim

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && mkdir -p /app/runtime

EXPOSE 3000

CMD ["sh", "-c", "npx wrangler dev --config dist/server/wrangler.json --ip 0.0.0.0 --port ${PORT:-3000} --persist-to /app/runtime --log-level info --show-interactive-dev-session=false"]
