# MIJOE — Financial Track

MIJOE is a microfinance platform powered by **SevisPass** digital identity, built by **Team MCM** for the **2026 DICT Hackathon**. It lets borrowers apply for and track microloans, and gives loan officers a staff portal to review applications, manage borrowers, and track repayments.

## Tech Stack

pnpm monorepo with two apps:

- **`apps/frontend`** — Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui + Radix primitives. Deployed to Vercel.
- **`apps/backend`** — Express 5 + TypeScript, Kysely + `pg` (PostgreSQL), session/auth scaffolding for SevisPass (OIDC4VP) login.

## Getting Started

### Prerequisites

- Node.js >= 22, pnpm >= 9 (`corepack enable` if pnpm isn't on your PATH)
- PostgreSQL reachable at the host/port configured in `apps/backend/src/database/index.ts` (defaults to `localhost:5434`, db `test`, user `admin`) — only needed for backend routes that hit the database.

### Installation

```bash
git clone https://github.com/mmanasi37/sevispas-dts26.git
cd sevispas-dts26
pnpm install
```

### Running locally

```bash
pnpm dev        # runs both apps in parallel (frontend on :3000, backend on :3001)
```

Or per app: `pnpm --filter mijoe-portal dev` (frontend) / `pnpm --filter sevispass dev` (backend, requires the database above).

### Environment variables

Copy `.env` at the repo root and fill in real values — see [SevisPass Integration](#sevispass-integration) below for what each one is for.

## Deployment

The frontend is deployed to Vercel as project `sevispas-dts26`, with **Root Directory** set to `apps/frontend` (Project Settings) and `apps/frontend/vercel.json` pinning `"framework": "nextjs"` — without that pin, Vercel falls back to a static "Other" build and every route 404s despite a successful `next build`. The backend is not currently deployed anywhere; it runs locally against a local Postgres instance.

## SevisPass Integration

Borrower login is meant to use **SevisPass** digital identity (OIDC4VP: QR code → wallet scan → verified credential presentation) instead of passwords. Staging docs: https://trust-id-hn.tech5.tech/docs.html.

**Confirmed:** the staging API is live at `https://trust-id-hn.tech5.tech` — `POST /api/auth/third-party/authorize` responds (with a 401 asking for client credentials), matching the docs exactly.

**Blocked on:** a real Client ID/Secret. The docs don't expose self-serve signup — you have to contact the SSO administrator to register our callback domain in the allowed-origins list and get credentials.

**Current code status (scaffolded, not finished):**

- `apps/backend/src/app.ts` — `/auth/initiate` and `/auth/callback` proxy to the SSO server server-side, which is the correct pattern (keeps the client secret out of the browser). Still hardcodes the SSO server URL instead of reading `OIDC4VP_SERVER_URL`, and is missing proxy endpoints for `/api/session/status` (QR poll) and `/api/user` (fetch verified identity) that the frontend flow needs.
- `apps/backend/src/libs/utils.ts` — `generateState`/`generateNonce` are real; `verifyState` always returns `true` and `processVPToken` returns a hardcoded fake user. Neither does real work yet.
- `apps/frontend/src/lib/DigitalIdentityAuth.ts` — **not safe to use as-is.** It calls the SSO server directly from the browser with the client secret attached, which would leak the secret to anyone inspecting network requests. This needs to be rewritten to call our own backend instead of the SSO server directly.
- `apps/frontend/src/app/borrower/login/page.tsx` — pure UI mock today; the "Biometric" tab doesn't call any of the above, it just fakes a delay and redirects.

Required env vars (`.env` at repo root, currently placeholders):

```
OIDC4VP_SERVER_URL=https://trust-id-hn.tech5.tech
CLIENT_ID=<from SSO administrator>
CLIENT_SECRET=<from SSO administrator>
CALLBACK_URL=<our deployed /auth/callback URL>
JWT_SECRET=<random secret>
SESSION_SECRET=<random secret>
ALLOWED_ORIGINS=<our deployed domain(s)>
ALLOWED_CALLBACK_URLS=<our deployed callback URL(s)>
```

## Team

**MCM** — 2026 DICT Hackathon

## License

TBD
