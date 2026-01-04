# Étape 1 : Installation des dépendances
FROM node:23-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Étape 2 : Construction de l'application
FROM node:23-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# On désactive la télémétrie Next.js pendant le build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Étape 3 : Image finale de production
FROM node:23-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# On crée un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# On récupère le dossier public (images, modèles 3D)
COPY --from=builder /app/public ./public

# On récupère le build standalone (contient le serveur minimal + node_modules nécessaires)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# À la place de CMD ["npm", "start"]
CMD ["node", "server.js"]