FROM node:22-slim

ENV PORT=3000

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build && mkdir -p /app/runtime

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "npx wrangler dev --config dist/server/wrangler.json --ip 0.0.0.0 --port ${PORT:-3000} --persist-to /app/runtime --log-level info --show-interactive-dev-session=false"]
