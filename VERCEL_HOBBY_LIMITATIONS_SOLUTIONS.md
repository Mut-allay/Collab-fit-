# Vercel Hobby Account Limitations - Solutions

## 🚨 **The Problem**
Vercel Hobby accounts are limited to **daily cron jobs only**. Your current setup tries to run Google Fit sync every 6 hours (`0 */6 * * *`), which exceeds the Hobby plan limits.

## 🆓 **Solution Options**

### **Option 1: Use Daily Sync Only (Simplest)**
Update your cron to run once daily instead of every 6 hours:

```json
"crons": [
  {
    "path": "/api/sync-google-fit",
    "schedule": "0 12 * * *"  // Daily at noon UTC
  },
  {
    "path": "/api/update-leaderboards", 
    "schedule": "0 0 * * *"   // Daily at midnight UTC
  }
]
```

### **Option 2: Manual Triggers + Daily Sync**
Keep daily sync but add manual trigger buttons in your app:

```typescript
// In your React app
const handleManualSync = async () => {
  const result = await syncGoogleFitData();
  if (result.success) {
    toast.success('Data synced successfully!');
  }
};
```

### **Option 3: Use GitHub Actions (Completely Free)**
GitHub Actions has no cron frequency limits:

```yaml
# .github/workflows/sync-data.yml
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours - no limits!
```

### **Option 4: Use Multiple Free Services**
- **Vercel**: Host your app + daily sync
- **GitHub Actions**: More frequent sync (every 6 hours)
- **Netlify**: Alternative hosting with different limits

## 🚀 **Recommended Solution: Hybrid Approach**

### **Step 1: Update Vercel Config for Daily Sync**
```json
{
  "crons": [
    {
      "path": "/api/sync-google-fit",
      "schedule": "0 12 * * *"  // Daily at noon
    },
    {
      "path": "/api/update-leaderboards",
      "schedule": "0 0 * * *"   // Daily at midnight
    }
  ]
}
```

### **Step 2: Add Manual Sync Button**
Add a "Sync Now" button in your app for users to trigger immediate sync.

### **Step 3: Use GitHub Actions for More Frequent Sync**
Set up GitHub Actions to run every 6 hours for more frequent updates.

## 📋 **Implementation Steps**

### **Option A: Daily Sync Only (Quick Fix)**

1. **Update vercel.json**:
```json
"crons": [
  {
    "path": "/api/sync-google-fit",
    "schedule": "0 12 * * *"
  },
  {
    "path": "/api/update-leaderboards",
    "schedule": "0 0 * * *"
  }
]
```

2. **Redeploy**:
```bash
vercel --prod
```

### **Option B: GitHub Actions (Recommended)**

1. **Keep Vercel for daily sync**
2. **Add GitHub Actions for frequent sync**:

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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: |
          cd api
          npm install
          node sync-google-fit.js
        env:
          FIREBASE_API_KEY: "AIzaSyAI_StR3wQSNcEZb78eFrVdz5HoGaXgcHg"
          FIREBASE_AUTH_DOMAIN: "fitspark-2.firebaseapp.com"
          FIREBASE_PROJECT_ID: "fitspark-2"
          FIREBASE_STORAGE_BUCKET: "fitspark-2.firebasestorage.app"
          FIREBASE_MESSAGING_SENDER_ID: "996004291289"
          FIREBASE_APP_ID: "1:996004291289:web:dad5a0de6b0c1eff1e54c8"
          GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
          GOOGLE_CLIENT_SECRET: ${{ secrets.GOOGLE_CLIENT_SECRET }}
          API_SECRET_KEY: ${{ secrets.API_SECRET_KEY }}
```

3. **Add secrets to GitHub repository**:
   - Go to Settings → Secrets and variables → Actions
   - Add: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `API_SECRET_KEY`

## 🎯 **Best Approach for You**

I recommend **Option B (GitHub Actions)** because:

✅ **Completely free** - No limits on cron frequency
✅ **Reliable** - GitHub Actions is very stable
✅ **Flexible** - Can run every 6 hours as originally planned
✅ **Backup** - Vercel daily sync as fallback
✅ **Manual triggers** - Can trigger sync manually from GitHub

## 🚀 **Quick Fix Right Now**

To get your deployment working immediately:

1. **Update vercel.json** with daily sync only
2. **Deploy to Vercel**
3. **Set up GitHub Actions** for more frequent sync later

This way you get:
- ✅ Working Vercel deployment
- ✅ Daily automatic sync
- ✅ Manual sync buttons in your app
- ✅ GitHub Actions for more frequent sync (optional)

## 💡 **Alternative: Upgrade to Vercel Pro**

If you want to stick with Vercel only:
- **Vercel Pro**: $20/month
- **Unlimited cron jobs**
- **More build minutes**
- **Better performance**

But the free solutions above work just as well! 🎉
