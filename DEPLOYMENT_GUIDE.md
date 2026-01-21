# FitSpark Deployment Guide

This guide covers deploying FitSpark to Vercel (frontend) and Render (backend).

## 🚀 Part 1: Deploy Frontend to Vercel

### Step 1: Fix Build Configuration

The `vercel.json` file has been fixed by removing the `_comment` property that was causing build errors.

### Step 2: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

**Required Variables:**
```
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

**Note:** Replace `your-render-backend.onrender.com` with your actual Render backend URL after deployment.

### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

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

1. Go back to Vercel dashboard
2. Update the `VITE_API_BASE_URL` environment variable with your Render backend URL
3. Redeploy the frontend

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

1. Visit your Vercel deployment URL
2. Test user authentication
3. Test Google Fit connection
4. Verify leaderboard updates

---

## 🔍 Troubleshooting

### Vercel Build Errors

- **Issue:** Build fails with schema validation error
- **Solution:** Ensure `vercel.json` doesn't have `_comment` or other unsupported properties

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
  - Verify `VITE_API_BASE_URL` is set correctly in Vercel
  - Check CORS settings in backend (should allow your Vercel domain)
  - Verify `API_SECRET_KEY` matches in both services
  - Check Render service is not sleeping (free tier limitation)

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
  - For production, consider restricting CORS to your Vercel domain:
    ```javascript
    app.use(cors({
      origin: process.env.FRONTEND_URL || 'https://your-vercel-app.vercel.app'
    }));
    ```

---

## 📊 Monitoring

### Vercel
- View deployment logs in Vercel dashboard
- Monitor build times and errors
- Check analytics for frontend performance

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

### Vercel (Frontend)
- **Free Tier:** Generous limits for personal projects
- **Hobby:** $20/month for more features
- **Pro:** $20/user/month for teams

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
- ✅ Frontend on Vercel
- ✅ Backend on Render
- ✅ Scheduled tasks configured
- ✅ Environment variables set

For support, check the logs in both Vercel and Render dashboards.

---

## 📝 Quick Reference

### Environment Variables Checklist

**Vercel (Frontend):**
- [ ] VITE_FIREBASE_API_KEY
- [ ] VITE_FIREBASE_AUTH_DOMAIN
- [ ] VITE_FIREBASE_PROJECT_ID
- [ ] VITE_FIREBASE_STORAGE_BUCKET
- [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
- [ ] VITE_FIREBASE_APP_ID
- [ ] VITE_FIREBASE_MEASUREMENT_ID
- [ ] VITE_API_BASE_URL
- [ ] VITE_API_SECRET_KEY

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
1. Check Vercel dashboard logs
2. Check Render dashboard logs
3. Verify environment variables
4. Test API endpoints manually
5. Review Firebase console for errors
6. Check CORS configuration

Good luck with your deployment! 🚀
