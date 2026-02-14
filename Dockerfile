# ---- Stage 1: Install dependencies ----
FROM node:20-slim AS deps
WORKDIR /app

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Stage 2: Build the app ----
FROM node:20-slim AS builder
WORKDIR /app

RUN npm i -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars must be set at build time (Next.js inlines them)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_STRIPE_PUBLIC_KEY

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_STRIPE_PUBLIC_KEY=$NEXT_PUBLIC_STRIPE_PUBLIC_KEY

RUN pnpm run build

# ---- Stage 3: Production runner ----
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy standalone output + static/public assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
