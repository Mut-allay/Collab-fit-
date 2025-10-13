# Free Alternatives to Firebase Functions

Since you don't have billing enabled for Firebase Functions, here are several free alternatives that will work perfectly for your team competition features.

## 🆓 **Option 1: Vercel Functions (Recommended)**

### **Why Vercel?**
- ✅ **Free tier**: 100GB-hours/month, 1M requests/month
- ✅ **Built-in cron jobs**: Perfect for scheduled tasks
- ✅ **Easy deployment**: Works with your existing React app
- ✅ **No billing required**: Generous free limits
- ✅ **Great developer experience**: Simple setup

### **Setup Steps**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy your app to Vercel**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   In Vercel dashboard, add these environment variables:
   ```
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   API_SECRET_KEY=your-secret-key-for-api-auth
   ```

4. **Deploy API Functions**
   ```bash
   vercel --prod
   ```

### **Scheduled Tasks**
Vercel automatically handles the cron jobs defined in `vercel.json`:
- **Google Fit Sync**: Every 6 hours
- **Leaderboard Updates**: Daily at midnight

---

## 🆓 **Option 2: Netlify Functions**

### **Why Netlify?**
- ✅ **Free tier**: 125K requests/month, 100GB bandwidth
- ✅ **Easy deployment**: Great for static sites
- ✅ **Built-in forms**: Can handle API endpoints

### **Setup Steps**

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Create netlify.toml**
   ```toml
   [build]
     functions = "netlify/functions"
   
   [[plugins]]
     package = "@netlify/plugin-scheduled-functions"
   
   [functions."sync-google-fit"]
     schedule = "0 */6 * * *"
   
   [functions."update-leaderboards"]
     schedule = "0 0 * * *"
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

---

## 🆓 **Option 3: GitHub Actions (Completely Free)**

### **Why GitHub Actions?**
- ✅ **Completely free**: 2,000 minutes/month for public repos
- ✅ **No external dependencies**: Uses your existing GitHub repo
- ✅ **Flexible scheduling**: Cron-based triggers
- ✅ **Full control**: Run any Node.js code

### **Setup Steps**

1. **Create GitHub Actions workflow**
   ```yaml
   # .github/workflows/sync-data.yml
   name: Sync Google Fit Data
   
   on:
     schedule:
       - cron: '0 */6 * * *'  # Every 6 hours
     workflow_dispatch:  # Manual trigger
   
   jobs:
     sync:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: |
             cd api
             npm install
             node sync-google-fit.js
           env:
             VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
             GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
             GOOGLE_CLIENT_SECRET: ${{ secrets.GOOGLE_CLIENT_SECRET }}
   ```

2. **Add secrets to GitHub repository**
   - Go to Settings → Secrets and variables → Actions
   - Add all your environment variables as secrets

---

## 🆓 **Option 4: Railway (Free Tier)**

### **Why Railway?**
- ✅ **Free tier**: $5 credit monthly (usually enough for small apps)
- ✅ **Easy deployment**: Git-based deployment
- ✅ **Built-in cron**: Scheduled jobs support

### **Setup Steps**

1. **Connect GitHub repository to Railway**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically on git push**

---

## 🆓 **Option 5: Render (Free Tier)**

### **Why Render?**
- ✅ **Free tier**: 750 hours/month
- ✅ **Cron jobs**: Built-in scheduled tasks
- ✅ **Easy setup**: Simple deployment

---

## 📊 **Comparison Table**

| Service | Free Tier | Cron Jobs | Ease of Setup | Best For |
|---------|-----------|-----------|---------------|----------|
| **Vercel** | 100GB-hrs, 1M requests | ✅ Built-in | ⭐⭐⭐⭐⭐ | React apps |
| **Netlify** | 125K requests | ✅ With plugin | ⭐⭐⭐⭐ | Static sites |
| **GitHub Actions** | 2K minutes | ✅ Native | ⭐⭐⭐ | Open source |
| **Railway** | $5 credit | ✅ Built-in | ⭐⭐⭐⭐ | Full-stack apps |
| **Render** | 750 hours | ✅ Built-in | ⭐⭐⭐⭐ | Any app |

## 🚀 **Recommended Implementation**

I recommend **Vercel Functions** because:

1. **Perfect fit**: Works seamlessly with your React app
2. **Built-in cron**: No additional setup needed
3. **Generous limits**: More than enough for your use case
4. **Great DX**: Excellent developer experience
5. **No billing**: Completely free for your needs

## 📝 **Implementation Steps**

1. **Choose Vercel** (recommended)
2. **Deploy your app** to Vercel
3. **Add the API functions** I created
4. **Set environment variables**
5. **Test the scheduled functions**

## 🔧 **Manual Triggers**

You can also trigger the functions manually from your app:

```typescript
import { syncGoogleFitData, updateCurrentMonthLeaderboard } from '@/lib/apiService';

// Manual sync (for testing)
const handleManualSync = async () => {
  const result = await syncGoogleFitData();
  if (result.success) {
    console.log('Sync completed successfully');
  }
};

// Manual leaderboard update
const handleUpdateLeaderboard = async () => {
  const result = await updateCurrentMonthLeaderboard();
  if (result.success) {
    console.log('Leaderboard updated');
  }
};
```

## 🎯 **Next Steps**

1. **Choose your preferred service** (I recommend Vercel)
2. **Deploy the API functions** I created
3. **Set up environment variables**
4. **Test the scheduled tasks**
5. **Monitor the functions** in your chosen platform

All of these alternatives will give you the same functionality as Firebase Functions, but completely free! 🎉
