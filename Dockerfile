# ─── Build the React client ──────────────────────────────────────────────────
FROM node:20-bookworm-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json client/package-lock.json ./client/
# The root postinstall installs the client too, with --include=dev so the
# build toolchain is present regardless of NODE_ENV.
RUN npm install --no-audit --no-fund

COPY . .

# Vite bakes `base` into the asset URLs at build time, so the mount prefix has
# to be present now — a runtime env var would be too late.
ARG BASE_PATH=""
ENV BASE_PATH=$BASE_PATH
RUN npm run build

# ─── Runtime: Express serves the API and the built client ────────────────────
FROM node:20-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
# Read by server/index.js to mount every route under the prefix.
ARG BASE_PATH=""
ENV BASE_PATH=$BASE_PATH

COPY package.json package-lock.json ./
# --ignore-scripts skips the postinstall that would pull in the client's
# toolchain; the built assets are copied from the builder instead.
RUN npm install --omit=dev --ignore-scripts --no-audit --no-fund

COPY server ./server
COPY scripts ./scripts
COPY migrations ./migrations
COPY docker-entrypoint.sh ./
COPY --from=builder /app/client/dist ./client/dist

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
