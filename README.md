# MIJOE — Financial Track

MIJOE is a microfinance platform powered by **SevisPass** digital identity, built by **Team MCM** for the **2026 DICT Hackathon**. Borrowers verify their identity with SevisPass and apply for microloans through an 8-step digital flow (no physical documents), and loan officers use a staff portal to review applications, manage borrowers, and track repayments.

## Tech Stack

pnpm monorepo with two apps:

- **`apps/frontend`** — Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui + Radix primitives. Deployed to Vercel.
- **`apps/backend`** — Express 5 + TypeScript, Kysely + `@libsql/kysely-libsql` (Turso/libSQL). Deployed to Vercel as its own zero-config Node backend project.

## Getting Started

### Prerequisites

- Node.js >= 22, pnpm >= 9 (`corepack enable` if pnpm isn't on your PATH). Node 20 also works locally in practice — pnpm just prints a harmless "unsupported engine" warning.
- A Turso database (libSQL) — see [Environment variables](#environment-variables) and [Database](#database-turso) below.
- The [Turso CLI](https://docs.turso.tech/cli/installation) if you need to pull fresh credentials or run schema changes directly.

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

Or per app: `pnpm --filter mijoe-portal dev` (frontend) / `pnpm --filter sevispass dev` (backend). Every borrower and staff screen fetches from the backend, so testing locally requires **both** running together, plus `apps/frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3001`.

### Environment variables

Copy `.env.example` to `apps/backend/.env` and fill in real values. On Vercel, `TURSO_DATABASE_URL`, `CLIENT_SECRET`, `JWT_SECRET`, etc. are stored as **Sensitive** environment variables, which means they can never be read back via `vercel env pull`, the dashboard, or the API once set — only the original source (Turso dashboard/CLI, whoever issued the SevisPass credentials) can recover them if lost locally.

```
# SevisPass staging SSO
OIDC4VP_SERVER_URL=https://sso.stage.sevispass.gov.pg
CLIENT_ID=<from SSO administrator>
CLIENT_SECRET=<from SSO administrator>
CALLBACK_URL=<our deployed /auth/callback URL>
WEB_ORIGIN=<our deployed frontend origin>

# Security
JWT_SECRET=<random secret>
SESSION_SECRET=<random secret>
ALLOWED_ORIGINS=<comma-separated allowed frontend origins>
ALLOWED_CALLBACK_URLS=<comma-separated allowed callback URLs>

# Turso (libSQL)
TURSO_DATABASE_URL=libsql://<your-db>.turso.io
TURSO_AUTH_TOKEN=<your-turso-auth-token>

HOST=0.0.0.0
PORT=3001
NODE_ENV=development
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

Both projects need their production environment variables set via `vercel env add` (or the dashboard) — env vars are per-project and don't carry over from local `.env`/`.env.local` files. Deploy with `vercel --prod` from each app directory after `git push`.

## Database (Turso)

The live schema is defined in `apps/backend/src/database/migration.ts` (a flat list of `CREATE TABLE` statements run once against a fresh database) — **not** `database.sql`, which is stale MySQL-dialect junk left over from early planning and will fail against SQLite/libSQL if you try to run it directly.

```bash
cd apps/backend
npx tsx src/database/migration.ts   # creates all 16 tables (Staff, Borrower, Loan, LoanApplication, LoanStatusType, LoanRepayment, ...)
npx tsx src/database/seed.ts        # seeds one Staff row, one Loan product, LoanStatusType rows, and the demo borrower SP-2024-001
```

`apps/backend/src/database/schema.ts` is **hand-maintained**, not auto-generated — despite `package.json` having a `db:generate:types` script, running `kysely-codegen` against this database produces an incompatible structure (different type/table naming convention, FK columns typed as `string` instead of `number`, no `Timestamp`/`Decimal` aliases) that breaks every file importing from it. If the live schema changes, hand-edit `schema.ts` to match rather than regenerating it.

## Borrower Portal

All 5 borrower screens (`apps/frontend/src/app/borrower/(portal)/`) share one layout with a persistent nav — Dashboard, Apply, Status, Repayments, Profile — and are fully wired to real backend data.

- **Login** (`apps/frontend/src/app/borrower/login/page.tsx`) uses real SevisPass biometric auth: QR code → wallet scan → verified identity, confirmed working end-to-end with a real physical SevisPass wallet. On success, the verified `sevispass_id` is persisted in an iron-session cookie (`apps/frontend/src/server/session.ts` + `server/actions.ts`) — no more hardcoded demo ID. Falls back to the seeded demo borrower `SP-2024-001` if nobody's logged in.
- Any real SevisPass identity that logs in for the first time is auto-provisioned a `Borrower` row (`findOrCreateBySevisPass` in `BorrowerRepository.ts`) — SevisPass only provides `sub`/`name`/`email`/`ageOver18`, so a couple of required-but-unavailable fields (`date_of_birth`, `id_number`) get placeholder values.
- **Apply** is a full 8-step wizard matching the hackathon spec: a Tier 2 SevisPass gate (heuristic — a verified credential with at least one government-ID-type entry counts as Tier 2+; SevisPass staging has no real tier field or upgrade API, so the "upload a document to upgrade" step is a UI-only placeholder), identity auto-fill, village/province/phone, self-declared employment/income, existing loans, a loan request with a live repayment calculator (real interest rate fetched from the seeded Loan product), disbursement preference, and a bilingual (English/Tok Pisin) digital declaration.
- **Read side** — `getBorrowerDashboard()` in `apps/frontend/src/lib/api.ts` powers credit score, total borrowed, repayment rate, active-loan balance, next payment, the full repayment schedule, and the latest application's status.

## Staff Portal

All 5 staff screens (`apps/frontend/src/app/staff/(portal)/`) share a top nav bar matching the borrower portal's style, and every page is wired to real data:

- **Dashboard** — real stat cards (new applications this week, pending approvals, active/approved loans, overdue repayments), real recent-applications list, real overdue-repayments list.
- **Applications** (list + review detail) — real application data including all the wizard's fields (village, existing loans, disbursement preference, declaration). Approve/Reject actually works: it records a real decision (`LoanApplicationStatus` row, `decided_at`/`reviewed_by`/`rejection_reason`), and approving generates a real fortnightly repayment schedule (`updateLoanApplicationDecision()` in `LoanRepository.ts`) — flat-rate calc, 5 installments for "short" term / 10 for "long" (the wizard only persists the coarse term category, not the exact fortnight count chosen on the calculator).
- **Borrowers** (list + detail) — real loan count and total-borrowed-when-approved per borrower, with a risk badge derived from the real `credit_score` field (a brand-new borrower with no track record reads as "high" risk on purpose — that's a real signal, not fabricated).
- **Repayments** — real repayment schedule aggregated across every loan, with real Paid/Overdue/Pending totals.
- **Login** (`apps/frontend/src/app/staff/login/page.tsx`) reuses the same real SevisPass biometric flow as the borrower login. Known gap: on success it doesn't persist `isLoggedIn` in the session, so `/staff` (the index redirect route) won't recognize you as logged in after a fresh visit — the credential (email/password) tab is also still a fake timed placeholder, and the underlying email/password staff-auth endpoints are broken regardless (see [Known gaps](#known-gaps)).

## Chache — AI Borrower Assistant

A floating chat widget (`apps/frontend/src/components/ChacheChat.tsx`), available on every borrower screen, backed by a streaming Next.js API route (`apps/frontend/src/app/api/chat/route.ts`) that calls the Anthropic API directly with `claude-opus-4-8`. It's scoped to loan/application/repayment questions in English or Tok Pisin, and is explicit that it doesn't know any specific borrower's real numbers (no tool/data integration yet) and can't make binding loan decisions.

Requires `ANTHROPIC_API_KEY` with an active billing/credits balance on the Anthropic account — the key can authenticate correctly and still fail with "credit balance too low" if the account has none. (Last confirmed status: blocked on billing, not re-verified since.)

## SevisPass Integration

Borrower and staff login use **SevisPass** digital identity (OIDC4VP: QR code → wallet scan → verified credential presentation) instead of passwords. Staging docs: https://trust-id-hn.tech5.tech/docs.html; actual staging SSO in use is `https://sso.stage.sevispass.gov.pg`.

**Working end-to-end**, confirmed with a real physical SevisPass wallet scan against production:

- `apps/backend/src/controllers/auth.controller.ts` — `/auth/initiate` kicks off the OIDC4VP flow and returns a real QR code + session; `/auth/session-status` and `/auth/user` proxy the poll and verified-identity fetch. All three read real `CLIENT_ID`/`CLIENT_SECRET`/`OIDC4VP_SERVER_URL` env vars (no more hardcoded URLs).
- `apps/frontend/src/lib/DigitalIdentityAuth.ts` calls **our own backend**, never the SSO server directly — the client secret never reaches the browser.
- On a verified login, the frontend persists the real `sevispass_id` in session and the backend auto-provisions a `Borrower` row for first-time identities.

**Not yet real:**

- `apps/backend/src/controllers/auth.controller.ts`'s `callback` handler — a *separate*, server-to-server callback path (not the one described above) still has stub `verifyState`/`processVPToken` in `apps/backend/src/libs/utils.ts` (`verifyState` always returns `true`, `processVPToken` does nothing real).
- The Tier 2 gate on the loan application wizard is a heuristic (see [Borrower Portal](#borrower-portal)), not a real tier check, since SevisPass staging doesn't expose one.

## Known gaps

- **Staff email/password auth is fully broken.** `apps/backend/src/database/schema.ts`'s `StaffTable` still declares `email`/`password`/`gender`/`phone_number` columns that don't exist on the live `Staff` table — `login`/`register`/`profile`/`forgotPassword`/`resetPassword` in `auth.controller.ts` would crash if ever hit. The real biometric SevisPass login works fine; only the credential-tab fallback and any direct staff-auth API usage are affected.
- **Staff biometric login doesn't persist `isLoggedIn`** in the session on success (see [Staff Portal](#staff-portal)).
- **Repayment schedules use an approximate installment count** (5 or 10, from the `short`/`long` term category) rather than the borrower's exact fortnight selection from the wizard's calculator, since that precise value isn't persisted.
- **SevisPass-only-provisioned borrowers get placeholder `date_of_birth`/`id_number`**, since SevisPass's credential payload doesn't include them.

## Team

**MCM** — 2026 DICT Hackathon

## License

TBD
