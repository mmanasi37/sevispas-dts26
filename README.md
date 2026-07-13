# MIJOE — Financial Track

MIJOE is a microfinance platform powered by **SevisPass** digital identity, built by **Team MCM** for the **2026 DICT Hackathon**. It lets borrowers apply for and track microloans, and gives loan officers a staff portal to review applications, manage borrowers, and track repayments.

## Tech Stack

pnpm monorepo with two apps:

- **`apps/frontend`** — Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui + Radix primitives. Deployed to Vercel.
- **`apps/backend`** — Express 5 + TypeScript, Kysely + `@libsql/kysely-libsql` (Turso/libSQL). Deployed to Vercel as its own zero-config Node backend project.

## Getting Started

### Prerequisites

- Node.js >= 22, pnpm >= 9 (`corepack enable` if pnpm isn't on your PATH)
- A Turso database (libSQL) — the backend no longer needs a local Postgres instance; see [Environment variables](#environment-variables).

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

Or per app: `pnpm --filter mijoe-portal dev` (frontend) / `pnpm --filter sevispass dev` (backend). Most borrower screens now fetch from the backend, so testing them locally requires **both** running together, plus `apps/frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3001`.

### Environment variables

Copy `.env.example` to `.env` at the repo root and fill in real values — see [SevisPass Integration](#sevispass-integration) below for the SSO-related vars. The backend also needs:

```
TURSO_DATABASE_URL=libsql://<your-db>.turso.io
TURSO_AUTH_TOKEN=<your-turso-auth-token>
```

The frontend needs its own `apps/frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001   # or the deployed backend URL
ANTHROPIC_API_KEY=<your-anthropic-api-key>  # powers Chache, see below
```

## Deployment

Both apps are deployed to Vercel as **separate projects**:

- **Frontend** — project `sevispas-dts26`, live at `https://sevispas-dts26.vercel.app`. Root Directory is `apps/frontend` (Project Settings), and `apps/frontend/vercel.json` pins `"framework": "nextjs"` — without that pin, Vercel falls back to a static "Other" build and every route 404s despite a successful `next build`.
- **Backend** — project `backend`, live at `https://backend-orpin-eight-mt95uqgqne.vercel.app`. Deployed zero-config as an Express app (Vercel auto-detects the framework and bundles `src/app.ts` as a single Lambda — no `vercel.json` needed). **Important:** this only works when the project is created via a fresh `vercel` deploy run directly from `apps/backend`; pre-creating the project with `vercel project add` leaves it stuck on generic "Other" framework detection with no way to fix it after the fact short of deleting and redeploying.

Both projects need their production environment variables set via `vercel env add` (or the dashboard) — env vars are per-project and don't carry over from local `.env`/`.env.local` files.

## Database (Turso)

Schema lives alongside the original Kysely-tutorial `person`/`pet` demo tables (untouched, unused): `borrowers`, `loan_applications`, `repayments`. Create/reset with:

```bash
cd apps/backend
pnpm tsx src/database/migrate.ts   # creates tables if they don't exist
pnpm tsx src/database/seed.ts      # wipes and reseeds one demo borrower (SP-2024-001) with 3 loans
```

## Borrower Portal

All 5 borrower screens (`apps/frontend/src/app/borrower/(portal)/`) share one layout with a persistent nav — Dashboard, Apply, Status, Repayments, Profile — and read/write real data from the backend:

- **Read side** — `getBorrowerDashboard()` in `apps/frontend/src/lib/api.ts` powers credit score, total borrowed, repayment rate, active-loan balance, next payment, the full repayment schedule, and the latest application's status.
- **Write side** — the Apply form POSTs to `POST /api/borrowers/:sevispassId/applications`, which creates a real `pending` application with a generated `MIJ-<year>-<NNN>` reference.
- There's no staff-approval flow yet, so a freshly submitted application has no repayment schedule — `getActiveLoan()` keeps showing the existing approved loan as "current" until something approves the new one.

There's no real session yet (SevisPass login isn't wired up — see below), so everything is hardcoded to the seeded demo borrower `SP-2024-001` (`apps/frontend/src/lib/session.ts`).

The **staff portal** (`apps/frontend/src/app/staff/`) is still 100% mock UI with no backend wiring.

## Chache — AI Borrower Assistant

A floating chat widget (`apps/frontend/src/components/ChacheChat.tsx`), available on every borrower screen, backed by a streaming Next.js API route (`apps/frontend/src/app/api/chat/route.ts`) that calls the Anthropic API directly with `claude-opus-4-8`. It's scoped to loan/application/repayment questions in English or Tok Pisin, and is explicit that it doesn't know any specific borrower's real numbers (no tool/data integration yet) and can't make binding loan decisions.

Requires `ANTHROPIC_API_KEY` with an active billing/credits balance on the Anthropic account — the key can authenticate correctly and still fail with "credit balance too low" if the account has none.

## SevisPass Integration

Borrower login is meant to use **SevisPass** digital identity (OIDC4VP: QR code → wallet scan → verified credential presentation) instead of passwords. Staging docs: https://trust-id-hn.tech5.tech/docs.html.

**Confirmed:** the staging API is live at `https://trust-id-hn.tech5.tech` — `POST /api/auth/third-party/authorize` responds (with a 401 asking for client credentials), matching the docs exactly.

**Blocked on:** a real Client ID/Secret. The docs don't expose self-serve signup — you have to contact the SSO administrator to register our callback domain in the allowed-origins list and get credentials. Now that the backend is deployed (see [Deployment](#deployment)), `CALLBACK_URL` should point at a real route on `https://backend-orpin-eight-mt95uqgqne.vercel.app` before requesting credentials.

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
