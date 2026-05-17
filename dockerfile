# ─── Stage 1 : Installation des dépendances ───────────────────────────────────
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --verbose

# ─── Stage 2 : Construction de l'application ──────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Génération du client Prisma avant le build Next.js
RUN ./node_modules/.bin/prisma generate

RUN npm run build

# ─── Stage 3 : Migrations (utilisé par le service migrate du docker-compose) ──
FROM node:22-alpine AS migrate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY package.json ./
RUN ./node_modules/.bin/prisma generate
RUN npm install --no-save tsx
CMD ["sh", "-c", "./node_modules/.bin/prisma db push --accept-data-loss && ./node_modules/.bin/tsx prisma/seed.ts"]

# ─── Stage 4 : Image finale de production ─────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
