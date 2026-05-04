Google Fit sync (“sync with the user’s device”)
Conceptually Fit data is pulled from Google’s Fitness API using a stored refresh token (after OAuth). Your app does not pair with the phone over Bluetooth; it trusts whatever Google has already synced from the user’s device/account.

What the repo does:

Connect: browser → GET {VITE_API_URL}/api/auth/google?userId=… → Google consent → /api/auth/google/callback stores googleFitRefreshToken etc. via Firebase Admin on users/{uid} (api/server.js around lines 89–155).
Manual sync: Profile “Sync now” → POST /api/sync-google-fit/me with Firebase ID token (googleFitService.ts, server.js ~183–198).
Bulk sync: POST /api/sync-google-fit with Authorization: Bearer API_SECRET_KEY (server.js ~205–236), intended for cron-job.org (or similar), not the browser.
So yes, the designed flow can work, provided:

OAuth redirect URIs in Google Cloud match GOOGLE_REDIRECT_URI (your API callback URL).
Firebase Admin env (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) matches the same Firestore your app uses.
VITE_API_URL in the web app points at that API (including in local dev).
Daily updates
The current api/server.js does not schedule jobs in-process (it ends with app.listen only; there is no node-cron here). “Daily” sync and leaderboard updates require an external scheduler hitting:

POST /api/sync-google-fit (bulk Fit sync)
POST /api/update-leaderboards (leaderboards; body is not required—the handler uses “now” for month/year, server.js ~242–252)
If those HTTP calls are never configured, nothing will run on a daily cadence automatically.

Leaderboards
Yes, the pipeline is implemented on the server: performLeaderboardUpdate reads active teams, aggregates dailyActivityLogs per member for the month, writes monthlyLeaderboards/{year}-{MonthName} (server.js ~345–376). The app reads that document via getMonthlyLeaderboard / useLeaderboard (Firestore from the client).

Caveat: leaderboard aggregation runs compound queries on dailyActivityLogs (userId + date range) in calculateTeamStats (~393–397). Your committed firestore.indexes.json does not define an index for that query. In production, Firestore often requires a composite index for that pattern; if it’s missing, leaderboard updates can fail until you add the index (Firebase often links to create it from an error in the logs).

Short answers to your three questions
Question	Answer
Is the backend flow working?
It can, if the API is running, env + VITE_API_URL are correct, and (for automation) cron jobs call the two POST endpoints.
Will syncing to the user’s device work?
Sync is Google Fit → your backend → Firestore, not direct to the device. It works if OAuth + Fit API + tokens + Admin SDK are configured.
Will daily updates + leaderboards work?
Leaderboard logic exists; daily behaviour depends on external cron. Firestore indexes may be required for leaderboard aggregation queries to succeed.

---

## Environment file layout

| Location | Purpose |
|---------|---------|
| `apps/web/.env`, `apps/web/.env.development` | **Only `VITE_*`** — Firebase web config and `VITE_API_URL`. Safe for client builds. Never put Firebase **private keys**, `GOOGLE_CLIENT_SECRET`, or `API_SECRET_KEY` here. |
| `api/.env` | **Express only** — `FIREBASE_SERVICE_ACCOUNT` (JSON single line) *or* `FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`, plus `GOOGLE_*`, `GOOGLE_REDIRECT_URI`, `FRONTEND_URL`, `API_SECRET_KEY`. Loaded via `dotenv` from `api/server.js`. |
| Repo root `.env` | Optional duplicate **`VITE_*`** for tooling; backend secrets belong in **`api/`**. |

## Local development

See **[LOCAL_DEV.md](./LOCAL_DEV.md)** for running `api/` + `apps/web/` on localhost, `VITE_API_URL`, `FRONTEND_URL`, and Google OAuth redirect setup.















