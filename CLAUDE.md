# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**FitSpark** is a fitness tracking and social competition platform. Users log daily fitness activity (steps, calories), join teams, and earn points on monthly leaderboards. Scheduled cron jobs aggregate activity data into pre-computed leaderboard documents that the frontend reads directly.

---

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, Radix UI, Framer Motion, Recharts, React Hook Form + Zod, TanStack Query, React Router v6
- **Backend**: Firebase (Auth, Firestore, Hosting), Express server on Render (`api/`)
- **Shared types**: `packages/shared` — Zod schemas + TypeScript types exported to both frontend and functions
- **Database seeding**: `packages/seeding/scripts/seed-client.js`

---

## Commands

All root commands use `pnpm` and route through Turborepo.

```bash
# Development
pnpm dev                    # Start Vite dev server (localhost:5173)
pnpm build                  # Production build
pnpm build:staging          # Staging build (uses .env.staging)
pnpm lint                   # ESLint across all packages
pnpm typecheck              # TypeScript check across all packages

# Testing (from root or apps/web)
pnpm test                   # Vitest watch mode
pnpm test:run               # Single run
pnpm test:coverage          # Coverage report

# Firebase local emulators (all: auth, functions, firestore, hosting, storage)
firebase emulators:start

# Deployment
pnpm deploy:hosting:staging         # Build staging + deploy frontend
pnpm deploy:hosting:production      # Build production + deploy frontend
pnpm deploy:functions:staging       # Build + deploy Cloud Functions (staging)
pnpm deploy:functions:production    # Build + deploy Cloud Functions (production)
firebase deploy --only firestore:indexes
firebase deploy --only firestore:rules


# Seed Firestore
pnpm seed
```

**Package manager**: `pnpm@9.15.9` required. **Node**: `20.x`.
**Firebase projects**: `fitspark-staging` (default) / `fitspark-production`. Switch with `firebase use <project>`.

---

## Architecture

### Monorepo Layout

```
apps/web/          React frontend (Vite)
packages/shared/   Shared Zod schemas + TypeScript types
packages/seeding/  Firestore seeding scripts
api/               Express server (Render, alternative cron host)
```

### Frontend (`apps/web/src/`)

- **Entry**: `main.tsx` → `App.tsx` (router) → `AuthProvider` wraps everything
- **Routing**: React Router v6. Two layouts:
  - `PublicLayout` — `/login`, `/signup`, `/verify`
  - `AppLayout` — all authenticated pages (`/dashboard`, `/leaderboard`, `/teams`, `/progress`, etc.)
  - Standalone (no layout) — `/workout/:planId/:phaseId`, `/workout-summary/:planId/:phaseId`
- **Auth**: `contexts/AuthContext.tsx` manages `currentUser` + `userProfile`. All Firebase auth calls go through `lib/authService.ts`. Protected routes check `currentUser` inside `AppLayout`.
- **State**: TanStack Query for server state. React Context for auth.
- **Path alias**: `@/` maps to `apps/web/src/`.

### Firestore Collections

| Collection                         | Purpose                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `users/{userId}`                   | User profile, fitness goals, Google Fit token state                      |
| `teams/{teamId}`                   | Team membership (memberIds, leaderId), `currentMonthTotal` cache         |
| `dailyActivityLogs/{logId}`        | Per-user daily steps + calories (`userId`, `date: YYYY-MM-DD`, `source`) |
| `monthlyLeaderboards/{YYYY-Month}` | Pre-aggregated team rankings; written by cron, read-only from frontend   |
| `workoutLogs/`                     | Individual workout session logs (indexed by userId + startTime)          |

### Leaderboard & Cron Flow

The leaderboard is **pre-computed, not query-time calculated**:

1. Users log activity → `dailyActivityLogs` (via Google Fit sync or manual input)
2. **Scheduled Cloud Function** (`functions/src/leaderboardAggregation.ts`) runs **daily at 00:00 UTC** via Firebase pub/sub:
   - Queries all active teams
   - Sums each member's `dailyActivityLogs` for the current month
   - Writes sorted results to `monthlyLeaderboards/{year}-{month}` (merge, not overwrite)
3. Frontend `LeaderboardPage` reads the pre-built document directly — no aggregation at query time
4. Manual trigger available via `updateLeaderboardManually` callable function (authenticated users only)

**Google Fit sync** (`functions/src/syncGoogleFit.ts`) runs every 6 hours, refreshes tokens, and writes to `dailyActivityLogs`.

Both write to the same Firestore collections; only one should be active per environment.


### Firestore Security Rules Summary

- Users: read/write own document only
- Teams: members can read; leader can update
- `dailyActivityLogs`: authenticated users can read all; users can only write their own
- `monthlyLeaderboards`: read-only for authenticated users (backend writes only)
- `workoutPrograms`: public programs readable by all authenticated users

---

## Google Fit OAuth Flow

No Firebase Functions are used (Spark plan). All background work runs on the Render Express backend.

**Connect flow (user-initiated):**

1. User clicks "Connect" in ProfilePage → `initiateGoogleFitConnect(uid)` in `apps/web/src/lib/googleFitService.ts`
2. Browser redirects to `GET /api/auth/google?userId={uid}` on Render backend
3. Backend redirects to Google OAuth consent screen
4. Google redirects to `GET /api/auth/google/callback` with auth code
5. Backend exchanges code for tokens, stores `googleFitRefreshToken` in `users/{uid}` via Admin SDK
6. Backend redirects to `/profile?googleFit=connected`
7. Frontend `ProfilePage` picks up the param via `useSearchParams`, shows toast, updates profile state

**Sync flow (automated):**

- `POST /api/sync-google-fit` — called by **cron-job.org** every 6 hours with `API_SECRET_KEY`; syncs all connected users (last 7 days of steps, calories, distance)
- `POST /api/sync-google-fit/me` — called by frontend "Sync Now" button with Firebase ID token; syncs current user only

**Leaderboard aggregation:**

- `POST /api/update-leaderboards` — called by **cron-job.org** daily at 00:05 UTC with `API_SECRET_KEY`

**Keep-alive:**

- `GET /health` — pinged every 10 min by cron-job.org / UptimeRobot to prevent Render free tier sleep

### Backend Environment Variables (Render)

| Variable                | Description                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| `FIREBASE_PROJECT_ID`   | Firebase project ID                                                          |
| `FIREBASE_CLIENT_EMAIL` | Service account client email                                                 |
| `FIREBASE_PRIVATE_KEY`  | Service account private key (with `\n` for newlines)                         |
| `GOOGLE_CLIENT_ID`      | OAuth2 client ID from Google Cloud Console                                   |
| `GOOGLE_CLIENT_SECRET`  | OAuth2 client secret                                                         |
| `GOOGLE_REDIRECT_URI`   | Must match GCP: `https://<render-app>.onrender.com/api/auth/google/callback` |
| `API_SECRET_KEY`        | Shared secret for cron-job.org endpoint auth                                 |
| `FRONTEND_URL`          | e.g. `https://fitspark-staging.web.app` — used for post-OAuth redirects      |

### Frontend Environment Variables

| Variable       | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| `VITE_API_URL` | Render backend URL, e.g. `https://<render-app>.onrender.com` |

## Current Focus

Ensuring fitness data (steps, calories, distance) is stored daily in `dailyActivityLogs` and aggregated nightly into `monthlyLeaderboards`. Key files:

- Backend: [api/server.js](api/server.js) — all OAuth, sync, and leaderboard endpoints
- Frontend service: [apps/web/src/lib/googleFitService.ts](apps/web/src/lib/googleFitService.ts)
- UI: [apps/web/src/overhaul/src/routes/profileRoute.tsx](apps/web/src/overhaul/src/routes/profileRoute.tsx) (wraps `ProfileView`) — Connected Services card
- Leaderboard display: [apps/web/src/pages/LeaderboardPage.tsx](apps/web/src/pages/LeaderboardPage.tsx)
