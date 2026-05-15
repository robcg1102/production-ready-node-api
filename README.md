# production-ready-node-api

A production-ready REST API template built with Node.js, Express, and TypeScript. Designed to be cloned and used as a solid foundation for real-world backend projects — with security, observability, and containerization configured from day one.

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 |
| Framework | Express 5 |
| Language | TypeScript 6 |
| ORM | Prisma 7 + PostgreSQL |
| Reverse Proxy | Nginx (stable-alpine) |
| Logging | Pino + pino-http |
| Metrics | prom-client (Prometheus-compatible) |
| Rate Limiting | express-rate-limit |
| Security | Helmet + CORS (configured) |
| Testing | Jest + Supertest |
| Containerization | Docker + Docker Compose |

---

## Features

- **Layered security** — Helmet with custom config, CORS with per-environment origins, rate limiting at the application level, and Nginx as a hardened reverse proxy
- **Container hardening** — read-only filesystem, `cap_drop: ALL`, `no-new-privileges`, non-root user inside the container
- **Structured logging** — JSON logs via Pino with request/response serializers and automatic ignore rules for noise (e.g. `/favicon.ico`)
- **Prometheus metrics** — exposed via a dedicated `/metrics` endpoint, ready to be scraped
- **Health checks** — `/health/live` endpoint used by Docker Compose to gate service startup order
- **Multi-stage Dockerfile** — separate `builder` and `runner` stages; production image only includes compiled output and production dependencies
- **Environment-aware** — separate `.env` and `.env.docker` files; `.env.example` included for onboarding

---

## Request Flow

```
Client → Nginx (reverse proxy) → Express
                                    ├── CORS
                                    ├── Helmet
                                    ├── express.json()
                                    ├── Rate Limiter
                                    ├── pino-http (logging)
                                    └── Routes
                                          ├── /health
                                          ├── /metrics
                                          └── notFoundHandler → errorHandler
```

---

## Project Structure

```
├── nginx/
│   └── nginx.conf              # Reverse proxy configuration
├── prisma/
│   └── schema.prisma           # Database schema
├── src/
│   ├── config/
│   │   ├── cors.ts             # CORS options (per-environment origins)
│   │   └── helmet.ts           # Helmet security headers config
│   ├── lib/
│   │   ├── logger.ts           # Pino logger instance
│   │   ├── metrics.ts          # Prometheus metrics definitions
│   │   └── prisma.ts           # Prisma client singleton
│   ├── middlewares/
│   │   ├── errorHandler.ts     # Centralized error handling
│   │   ├── notFoundHandler.ts  # 404 fallback
│   │   ├── rateLimiter.ts      # express-rate-limit config
│   │   └── requestLogger.ts    # HTTP request logging
│   ├── routes/
│   │   ├── health.routes.ts    # /health/live endpoint
│   │   ├── metric.routes.ts    # /metrics endpoint
│   │   └── index.ts            # Route registration
│   ├── tests/
│   │   ├── health.test.ts
│   │   └── metrics.test.ts
│   ├── app.ts                  # Express app setup
│   └── server.ts               # HTTP server bootstrap
├── .env.example
├── .env.docker
├── docker-compose.yml
├── Dockerfile
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 22
- Docker and Docker Compose

### Option 1 — Docker (recommended)

```bash
# 1. Clone the repo
git clone https://github.com/robcg1102/production-ready-node-api.git
cd production-ready-node-api

# 2. Set up environment variables
cp .env.example .env

# 3. Start all services (Nginx + API + PostgreSQL)
docker compose up --build
```

The API will be available at `http://localhost` (port 80 via Nginx).

### Option 2 — Local development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Fill in PORT and DATABASE_URL

# 3. Generate Prisma client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev

# 5. Start dev server (with hot reload)
npm run dev
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server listens on | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/appdb` |

> For Docker, use `.env.docker` — the Compose file uses this for the `api` service. The default Postgres credentials in `docker-compose.yml` are for local development only; **change them before any deployment**.

---

## Available Scripts

```bash
npm run dev          # Start dev server with hot reload (tsx watch)
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled server
npm test             # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health/live` | Liveness check — returns 200 if the server is up |
| `GET` | `/metrics` | Prometheus-compatible metrics |

---

## Security Decisions

**Why Helmet with custom config?**
Default Helmet settings are a good baseline, but this template configures headers explicitly so that each directive is a conscious choice rather than an implicit default. This makes security audits easier.

**Why CORS configured separately?**
Externalizing CORS config to `src/config/cors.ts` allows per-environment origins (dev vs prod) without touching `app.ts`.

**Why `trust proxy 1`?**
Required for `express-rate-limit` to correctly read the client IP when running behind Nginx. Without it, all requests appear to come from `127.0.0.1`.

**Why `cap_drop: ALL` in Docker Compose?**
Dropping all Linux capabilities from the container and running as a non-root user (`appuser`) means that even if the application is compromised, the attacker has no kernel-level privileges to escalate with.

**Why rate limiting at the app level if Nginx is also in front?**
Defense in depth. Nginx-level rate limiting protects the host; app-level rate limiting is a fallback for cases where the app is accessed directly (e.g. during local development or internal service calls).
