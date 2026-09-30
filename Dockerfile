FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app


FROM base AS deps

COPY package.json package-lock.json ./

RUN npm ci


FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_IMG_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG PORT

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_IMG_URL=${NEXT_PUBLIC_IMG_URL}
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
ENV PORT=${PORT}

RUN npm run build


FROM node:20-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 5050

CMD ["node", "server.js"]