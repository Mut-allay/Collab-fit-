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

**Settings:**
- **Name:** `fitspark-api` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `main` (or your deployment branch)
- **Root Directory:** `api`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** `Node`

### Step 3: Set Environment Variables in Render

In your Render service dashboard, go to **Environment** and add:

**Firebase Configuration:**
```
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-firebase-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
```

**Google OAuth (for Google Fit):**
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**API Security:**
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

1. Update `VITE_API_BASE_URL` in your `.env.staging` or `.env.production` file
2. Rebuild and redeploy:
   ```bash
   # For staging
   pnpm run deploy:hosting:staging
   
   # For production
   pnpm run deploy:hosting:production
   ```

---

## 🔄 Scheduled Tasks (Cron Jobs)

The backend server includes scheduled tasks using `node-cron`:
- **Google Fit Sync:** Daily at 12:00 PM UTC
- **Leaderboard Update:** Daily at midnight UTC

These run automatically on Render. You can also trigger them manually via API calls.

**Note:** On Render's free tier, services may sleep after inactivity. Consider upgrading to keep the service always running for reliable cron jobs, or use Render's Cron Jobs feature.

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
- [ ] VITE_API_BASE_URL
- [ ] VITE_API_SECRET_KEY

**Note:** These are set in `.env` files and baked into the build at build time.

**Render (Backend):**
- [ ] FIREBASE_API_KEY
- [ ] FIREBASE_AUTH_DOMAIN
- [ ] FIREBASE_PROJECT_ID
- [ ] FIREBASE_STORAGE_BUCKET
- [ ] FIREBASE_MESSAGING_SENDER_ID
- [ ] FIREBASE_APP_ID
- [ ] FIREBASE_MEASUREMENT_ID
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] API_SECRET_KEY

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

## 📚 Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Render Documentation](https://render.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

Good luck with your deployment! 🚀
