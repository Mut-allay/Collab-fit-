# FitSpark Deployment Guide

This guide covers deploying FitSpark to Firebase Hosting (frontend) and Render (backend).

## 📋 Quick Start

**Architecture:**
- **Frontend:** Firebase Hosting (static site hosting)
- **Authentication:** Firebase Authentication
- **Database:** Firestore
- **Backend API:** Render (Express server)
- **Scheduled Tasks:** node-cron on Render

**Deployment Flow:**
1. Set environment variables in `.env` files
2. Build frontend with correct environment
3. Deploy frontend to Firebase Hosting
4. Deploy backend to Render
5. Update frontend with Render backend URL
6. Redeploy frontend

---

## 🚀 Part 1: Deploy Frontend to Firebase Hosting

### Step 1: Prerequisites

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Verify Firebase Project:**
   - Check `.firebaserc` to see your configured projects
   - Default project: `fitspark-staging`
   - Production project: `fitspark-production`

### Step 2: Configure Environment Variables

Firebase Hosting uses environment variables at **build time** (not runtime). You need to set them in `.env` files:

**For Staging** (`apps/web/.env.staging`):
```bash
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_API_BASE_URL=https://your-render-backend.onrender.com
VITE_API_SECRET_KEY=your-secret-key
```

**For Production** (`apps/web/.env.production`):
```bash
VITE_FIREBASE_API_KEY=your-production-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-production-firebase-auth-domain
VITE_FIREBASE_PROJECT_ID=your-production-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-production-firebase-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-production-messaging-sender-id
VITE_FIREBASE_APP_ID=your-production-firebase-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-production-measurement-id
VITE_API_BASE_URL=https://your-render-backend.onrender.com
VITE_API_SECRET_KEY=your-secret-key
```

**Note:** 
- Replace `your-render-backend.onrender.com` with your actual Render backend URL after deployment
- These values are baked into the build, so make sure they're correct before building
- Never commit `.env` files with real secrets to version control

### Step 3: Build and Deploy

**Deploy to Staging:**
```bash
# From project root
pnpm run deploy:hosting:staging
```

**Deploy to Production:**
```bash
# From project root
pnpm run deploy:hosting:production
```

**Manual Deployment:**
```bash
# Build for staging
pnpm run build:staging --filter=@fitspark/web

# Switch to staging project
firebase use fitspark-staging

# Deploy hosting only
firebase deploy --only hosting

# Or for production
pnpm run build:production --filter=@fitspark/web
firebase use fitspark-production
firebase deploy --only hosting
```

### Step 4: Verify Deployment

1. Visit your Firebase Hosting URL (shown after deployment)
2. Test user authentication
3. Verify the app loads correctly
4. Check browser console for any errors

---

## 🔧 Part 2: Deploy Backend to Render

### Step 1: Prepare Backend

The backend server is located in the `api/` directory. Make sure you have:
- `api/server.js` - Express server
- `api/package.json` - Dependencies

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

**Settings (monorepo — build from repo root):**
- **Name:** `fitspark-api` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `main` (or your deployment branch)
- **Root Directory:** leave **empty** (repository root), unless you only copy the `api/` folder into its own repo
- **Runtime:** `Node`
- **Build Command:** `pnpm install` (uses `pnpm-lock.yaml`; requires **pnpm** — see [Render pnpm](https://render.com/docs/using-pnpm))
- **Start Command:** `pnpm --filter fitspark-api start` (runs `node server.js` in `api/`)
- **Environment:** `Node` 20.x

### Step 3: Set Environment Variables in Render

In your Render service dashboard, go to **Environment** and add variables. The API uses **Firebase Admin SDK** credentials (not the web client `VITE_FIREBASE_*` keys).

**Firebase Admin (choose one approach):**

*Option A — single JSON (common on Render):* paste the full service account JSON as one line into **`FIREBASE_SERVICE_ACCOUNT`** (must start with `{`). From Google Cloud Console → IAM & Admin → Service Accounts → your account → Keys → Add key → JSON.

*Option B — three separate fields:*
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```
Use literal `\n` in the private key string if Render’s editor does not preserve newlines.

**Google OAuth (Google Fit):**
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-service.onrender.com/api/auth/google/callback
```
`GOOGLE_REDIRECT_URI` must match an **Authorized redirect URI** in Google Cloud Console (OAuth 2.0 Client).

**Frontend + CORS (comma-separated if you use local Vite + hosted app):**
```
FRONTEND_URL=https://your-app.web.app,http://localhost:5173
```

**API Security (cron / bulk endpoints):**
```
API_SECRET_KEY=your-strong-secret-key-here
```

**Note:** Generate a strong `API_SECRET_KEY`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Deploy

1. Click **Create Web Service**
2. Render will automatically build and deploy your backend
3. Wait for deployment to complete
4. Copy your service URL (e.g., `https://fitspark-api.onrender.com`)

### Step 5: Update Frontend with Backend URL

1. Update **`VITE_API_URL`** in your `.env.staging` or `.env.production` (or Firebase Hosting env at build time) to your Render URL, e.g. `https://your-service.onrender.com`
2. Rebuild and redeploy:
   ```bash
   # For staging
   pnpm run deploy:hosting:staging
   
   # For production
   pnpm run deploy:hosting:production
   ```

---

## 🔄 Scheduled Tasks (external cron)

The Express API exposes secured HTTP endpoints (e.g. **`POST /api/sync-google-fit`**, **`POST /api/update-leaderboards`**) meant to be called by **cron-job.org** (or similar) with header **`Authorization: Bearer <API_SECRET_KEY>`**. The service does not run `node-cron` inside the process.

**Note:** On Render's free tier, services may sleep after inactivity. Use a keep-alive ping on **`GET /health`** and schedule crons slightly after the service is likely awake, or upgrade the instance for predictable wake windows.

---

## 🧪 Testing Your Deployment

### Test Backend

```bash
# Health check
curl https://your-render-backend.onrender.com/health

# Test Google Fit sync (replace with your API_SECRET_KEY)
curl -X POST https://your-render-backend.onrender.com/api/sync-google-fit \
  -H "Authorization: Bearer your-api-secret-key"

# Test leaderboard update
curl -X POST https://your-render-backend.onrender.com/api/update-leaderboards \
  -H "Authorization: Bearer your-api-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"month": "January", "year": 2025}'
```

### Test Frontend

1. Visit your Firebase Hosting URL (e.g., `https://fitspark-staging.web.app`)
2. Test user authentication
3. Test Google Fit connection
4. Verify leaderboard updates

---

## 🔍 Troubleshooting

### Firebase Build Errors

- **Issue:** Build fails or wrong environment variables used
- **Solution:** 
  - Ensure you're using the correct build command (`build:staging` vs `build:production`)
  - Check that `.env.staging` or `.env.production` files exist and have correct values
  - Verify Firebase project is set correctly: `firebase use <project-name>`

### Firebase Deployment Issues

- **Issue:** Deployment fails
- **Solution:**
  - Check that `apps/web/dist` directory exists after build
  - Verify Firebase CLI is logged in: `firebase login`
  - Check Firebase project permissions
  - Review `firebase.json` configuration

### Render Deployment Issues

- **Issue:** Service fails to start
- **Solution:** 
  - Check logs in Render dashboard
  - Verify all environment variables are set
  - Ensure `package.json` has correct start script
  - Check that `server.js` exists in the `api/` directory

### API Connection Issues

- **Issue:** Frontend can't connect to backend
- **Solution:**
  - Verify `VITE_API_BASE_URL` is set correctly in your `.env` file and rebuild
  - Check CORS settings in backend (should allow your Firebase Hosting domain)
  - Verify `API_SECRET_KEY` matches in both services
  - Check Render service is not sleeping (free tier limitation)
  - Check browser console for CORS errors

### Scheduled Tasks Not Running

- **Issue:** Cron jobs not executing
- **Solution:**
  - Check Render logs for cron execution
  - Verify server is running (not sleeping on free tier)
  - Consider using Render Cron Jobs feature for more reliability
  - Upgrade to paid plan to prevent service from sleeping

### CORS Errors

- **Issue:** CORS errors when frontend calls backend
- **Solution:**
  - The backend uses `cors()` middleware which allows all origins by default
  - For production, consider restricting CORS to your Firebase Hosting domain:
    ```javascript
    app.use(cors({
      origin: process.env.FRONTEND_URL || 'https://your-firebase-project.web.app'
    }));
    ```
  - Add your Firebase Hosting domain to the allowed origins list

---

## 📊 Monitoring

### Firebase Hosting
- View deployment history in Firebase Console → Hosting
- Monitor site performance in Firebase Console → Performance
- Check analytics in Firebase Console → Analytics
- View real-time usage in Firebase Console → Usage

### Render
- View service logs in Render dashboard
- Monitor uptime and response times
- Check scheduled task execution logs
- Monitor service health and restarts

---

## 🔐 Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Rotate API keys** regularly
3. **Use strong API_SECRET_KEY** - Generate with crypto.randomBytes
4. **Enable CORS properly** - Only allow your frontend domain
5. **Monitor logs** for suspicious activity
6. **Keep dependencies updated** - Regularly update npm packages

---

## 💰 Cost Considerations

### Firebase Hosting (Frontend)
- **Spark Plan (Free):** 
  - 10 GB storage
  - 360 MB/day data transfer
  - Custom domain support
  - SSL certificates included
- **Blaze Plan (Pay-as-you-go):**
  - Same as Spark, but pay for additional usage
  - $0.026/GB for storage over 10 GB
  - $0.15/GB for data transfer over 360 MB/day
  - Very affordable for small to medium projects

**Note:** Firebase Hosting is very generous on the free tier and perfect for most projects.

### Render (Backend)
- **Free Tier:** 
  - Services may sleep after 15 minutes of inactivity
  - Cron jobs may not run reliably if service is sleeping
- **Starter:** $7/month per service
  - Services stay awake
  - More reliable for cron jobs
- **Standard:** $25/month per service
  - Better performance and reliability

**Recommendation:** For production, consider upgrading Render to at least Starter plan to ensure cron jobs run reliably.

---

## 🎉 You're All Set!

Your FitSpark application is now deployed:
- ✅ Frontend on Firebase Hosting
- ✅ Backend on Render
- ✅ Authentication via Firebase Auth
- ✅ Scheduled tasks configured
- ✅ Environment variables set

For support, check the logs in both Firebase Console and Render dashboards.

---

## 📝 Quick Reference

### Environment Variables Checklist

**Firebase Hosting (Frontend - in `.env.staging` or `.env.production`):**
- [ ] VITE_FIREBASE_API_KEY
- [ ] VITE_FIREBASE_AUTH_DOMAIN
- [ ] VITE_FIREBASE_PROJECT_ID
- [ ] VITE_FIREBASE_STORAGE_BUCKET
- [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
- [ ] VITE_FIREBASE_APP_ID
- [ ] VITE_FIREBASE_MEASUREMENT_ID
- [ ] VITE_API_URL (Render base URL, no trailing slash)

**Note:** These are set in `.env` files and baked into the build at build time.

**Render (Backend — Firebase Admin + OAuth):**
- [ ] **`FIREBASE_SERVICE_ACCOUNT`** (JSON one line) **or** **`FIREBASE_PROJECT_ID`** + **`FIREBASE_CLIENT_EMAIL`** + **`FIREBASE_PRIVATE_KEY`**
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `GOOGLE_REDIRECT_URI` (must match Google Cloud OAuth redirect for this Render URL)
- [ ] `FRONTEND_URL` (hosted app URL; add `http://localhost:5173` if you develop against live API)
- [ ] `API_SECRET_KEY`

---

## 🆘 Need Help?

If you encounter issues:
1. Check Firebase Console → Hosting for deployment logs
2. Check Render dashboard logs
3. Verify environment variables in `.env` files
4. Test API endpoints manually
5. Review Firebase console for errors
6. Check CORS configuration
7. Verify build output in `apps/web/dist` directory

## 🔥 Part 5: Deploy Firestore Indexes and Security Rules

### Why This Matters

Firestore requires **composite indexes** for complex queries (queries with multiple `where()` clauses and `orderBy()`). Without these indexes, your app will throw errors like:

```
FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/...
```

### Step 1: Deploy Firestore Indexes

Your project already has a `firestore.indexes.json` file with the required indexes. To deploy them:

1. **Switch to the correct Firebase project:**
   ```bash
   firebase use fitspark-production  # or fitspark-staging
   ```

2. **Deploy the indexes:**
   ```bash
   firebase deploy --only firestore:indexes
   ```

3. **Wait for indexes to build:**
   - Go to [Firebase Console → Firestore → Indexes](https://console.firebase.google.com/project/fitspark-production/firestore/indexes)
   - Indexes will show status: "Building" → "Enabled" (takes 3-10 minutes)
   - Your app will continue to throw errors until indexes are "Enabled"

### Step 2: Deploy Security Rules

Your `firestore.rules` file contains security rules. Deploy them:

```bash
firebase deploy --only firestore:rules
```

**Important:** The security rules allow:
- ✅ Authenticated users can read `monthlyLeaderboards`
- ✅ Users can only read/write their own `workoutLogs`
- ✅ Users can only read/write their own `metricSnapshots`

### Step 3: Verify Deployment

1. **Check indexes status:**
   ```bash
   firebase firestore:indexes
   ```

2. **Test in Firebase Console:**
   - Go to Firestore Database → Indexes tab
   - Verify all indexes show "Enabled" status

3. **Test security rules:**
   - Go to Firestore Database → Rules tab
   - Use the Rules Playground to test queries

### Quick Fix for Missing Indexes

If you see an error with a Firebase Console link:
1. Click the link in the error message (it's pre-filled with the correct index)
2. Click "Create Index" in the Firebase Console
3. Wait 3-10 minutes for the index to build

**Or** add the index to `firestore.indexes.json` and deploy:
```bash
firebase deploy --only firestore:indexes
```

### Current Indexes in `firestore.indexes.json`

Your project includes indexes for:
- `workoutLogs` collection: `userId` (ASC) + `startTime` (ASC) - for range queries
- `workoutLogs` collection: `userId` (ASC) + `startTime` (DESC) - for simple orderBy queries

These cover all your current query patterns.

## 📚 Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firestore Indexes Documentation](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Render Documentation](https://render.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

Good luck with your deployment! 🚀
