# Local development (web + Render-style API)

## Local UI + deployed API (recommended for day-to-day)

Use **Vite on your machine** (`pnpm dev:web`) while **`VITE_API_URL`** points at your **hosted Render** API (same as production/staging). Firebase Auth and Firestore run in the **browser** against your real Firebase project using the existing **`VITE_FIREBASE_*`** keys—no local API required.

1. In **`apps/web/.env`** or **`.env.development.local`**, set:
   - `VITE_API_URL=https://your-api.onrender.com` (your deployed base URL, no trailing slash).
   - Keep your normal **`VITE_FIREBASE_*`** values.

2. Run **`pnpm dev:web`** and open **http://localhost:5173**.

3. **CORS on Render:** the API uses `FRONTEND_URL` for `cors` origins. To allow localhost, set **`FRONTEND_URL`** on Render to a **comma-separated** list, for example:
   - `https://your-app.web.app,http://localhost:5173`  
   (Order does not matter; the first entry is still the default redirect target when no `returnOrigin` is used.)

4. **Google Fit “Connect”** from localhost: the frontend sends **`returnOrigin=http://localhost:5173`**. The API only redirects there if that origin is **allowed** (localhost / 127.0.0.1 or listed in `FRONTEND_URL`). Deploy the updated **`api/server.js`** so this behavior is live.

**Sync now** and other `POST`/`DELETE` calls use your **Firebase ID token** in `Authorization: Bearer …`—unchanged.

---

## Full stack local (API + web on this machine)

Run the **Vite app** and the **Express API** on your machine so Google Fit OAuth, manual sync, and Firestore reads/writes behave like production—without deploying.

## Prerequisites

- **Node 20.x** and **pnpm 9** (see repo `package.json` / `CLAUDE.md`).
- A **Firebase** web app + project (same project the API uses with Admin SDK).
- **Google Cloud** OAuth client with the **local redirect URI** registered (see below).

## 1. API (`api/`)

1. From the repo root: `pnpm install` (installs workspace deps including `api`).
2. Copy the example env file:
   ```bash
   cp api/.env.example api/.env
   ```
3. Edit **`api/.env`**. Set at least:
   - **Firebase Admin** — either `FIREBASE_SERVICE_ACCOUNT` (single-line JSON) **or** `FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY` (use `\n` in the key for newlines).
   - **`GOOGLE_CLIENT_ID`**, **`GOOGLE_CLIENT_SECRET`**
   - **`GOOGLE_REDIRECT_URI`** — for local API on port 3000:
     `http://localhost:3000/api/auth/google/callback`
   - **`FRONTEND_URL`** — where Vite serves the app:
     `http://localhost:5173`
   - **`API_SECRET_KEY`** — any long random string (cron / bulk endpoints only; never put this in the web app).

4. In **Google Cloud Console → APIs & Services → Credentials → your OAuth client**, add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/google/callback`  
   (Must match **`GOOGLE_REDIRECT_URI`** exactly.)

5. Start the API (default port **3000** unless you set `PORT`):

   ```bash
   pnpm dev:api
   ```

   Or: `pnpm --filter fitspark-api dev` (uses `node --watch server.js`).

## 2. Web app (`apps/web/`)

1. Copy the example and name it so Vite picks it up for **development** (overrides are optional; you can instead edit your existing `.env` for a session):

   ```bash
   cp apps/web/.env.development.example apps/web/.env.development.local
   ```

2. Set **`VITE_API_URL=http://localhost:3000`** (must match where the API listens).

3. Fill **`VITE_FIREBASE_*`** from the Firebase console (same as today; no secrets beyond the public web API key).

4. Start only the web app:

   ```bash
   pnpm dev:web
   ```

   Open **http://localhost:5173**.

**Note:** Root `pnpm dev` runs **Turbo** `dev` for every package that defines a `dev` script (web + API + others). For a predictable two-process setup, prefer **`pnpm dev:api`** in one terminal and **`pnpm dev:web`** in another.

## 3. What to verify

| Check | How |
|--------|-----|
| API up | Browser or curl: `http://localhost:3000/health` (if exposed in `server.js`) or hit a known route. |
| CORS | `FRONTEND_URL` should be `http://localhost:5173` so the browser can call the API. |
| Connect Google Fit | Dashboard / Profile → expect redirect to Google, then back to **`FRONTEND_URL`** with `?googleFit=connected` or `?googleFit=error`. |
| Sync now | Network tab: `POST http://localhost:3000/api/sync-google-fit/me` with **`Authorization: Bearer <Firebase ID token>`** (not `API_SECRET_KEY`). |
| Data | Firebase console → **`dailyActivityLogs`** documents like `{userId}_{YYYY-MM-DD}`. |

## 4. Switching back to hosted API

In **`apps/web/.env`** or **`.env.development.local`**, set:

`VITE_API_URL=https://your-service.onrender.com`

Remove or override local values so you do not accidentally point staging users at localhost.

## Security

- Never commit **`api/.env`** or real **`.env.development.local`** (they are gitignored).
- Only **`VITE_*`** belongs in the web env files; keep **service account JSON**, **Google client secret**, and **`API_SECRET_KEY`** on the API only.
