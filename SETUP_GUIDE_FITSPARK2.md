# FitSpark-2 Setup Guide

This guide will help you set up the team competition features for your **fitspark-2** Firebase project using free alternatives to Firebase Functions.

## 🎯 **Your Firebase Project Details**
- **Project ID**: `fitspark-2`
- **Auth Domain**: `fitspark-2.firebaseapp.com`
- **Storage Bucket**: `fitspark-2.firebasestorage.app`

## 🚀 **Option 1: Vercel Functions (Recommended)**

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Deploy to Vercel**
```bash
# In your project root
vercel
```

### **Step 3: Set Environment Variables in Vercel Dashboard**
Go to your Vercel project dashboard → Settings → Environment Variables and add:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
API_SECRET_KEY=your-secret-key-for-api-auth
```

**Note**: Your Firebase config is already hardcoded in the API functions, so no need to set those.

### **Step 4: Deploy API Functions**
```bash
vercel --prod
```

### **Step 5: Test the Functions**
Your functions will be available at:
- `https://your-app.vercel.app/api/sync-google-fit`
- `https://your-app.vercel.app/api/update-leaderboards`

## 🔄 **Option 2: GitHub Actions (Completely Free)**

### **Step 1: Add Secrets to GitHub Repository**
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
API_SECRET_KEY=your-secret-key-for-api-auth
```

### **Step 2: Push to GitHub**
```bash
git add .
git commit -m "Add team competition API functions"
git push origin main
```

### **Step 3: Test GitHub Actions**
- Go to your GitHub repository
- Click on "Actions" tab
- You should see the workflow running automatically
- You can also trigger it manually by clicking "Run workflow"

## 🔧 **Google Cloud Console Setup**

### **Step 1: Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the **Google Fit API**

### **Step 2: Create OAuth 2.0 Credentials**
1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://your-app.vercel.app` (for production)
5. Note down your **Client ID** and **Client Secret**

### **Step 3: Configure OAuth Consent Screen**
1. Go to OAuth consent screen
2. Fill in required information
3. Add scopes:
   - `https://www.googleapis.com/auth/fitness.activity.read`
   - `https://www.googleapis.com/auth/fitness.body.read`

## 📱 **Update Your React App**

### **Step 1: Update Environment Variables**
Create `.env.local` in your `apps/web` directory:
```bash
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_API_KEY=your-google-api-key
VITE_API_SECRET_KEY=your-secret-key-for-api-auth
```

### **Step 2: Update API Service**
The API service is already created at `apps/web/src/lib/apiService.ts`. Update the base URL:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app.vercel.app/api'  // Replace with your Vercel URL
  : 'http://localhost:3000/api';
```

## 🧪 **Testing the Setup**

### **Test 1: Manual API Calls**
```bash
# Test Google Fit sync
curl -X POST https://your-app.vercel.app/api/sync-google-fit \
  -H "Authorization: Bearer your-api-secret-key"

# Test leaderboard update
curl -X POST https://your-app.vercel.app/api/update-leaderboards \
  -H "Authorization: Bearer your-api-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"month": "December", "year": 2024}'
```

### **Test 2: From Your React App**
```typescript
import { syncGoogleFitData, updateCurrentMonthLeaderboard } from '@/lib/apiService';

// Test manual sync
const handleTest = async () => {
  const result = await syncGoogleFitData();
  console.log('Sync result:', result);
};
```

## 📊 **Monitoring**

### **Vercel Dashboard**
- Go to your Vercel project dashboard
- Click on "Functions" tab
- View logs and metrics

### **GitHub Actions**
- Go to your GitHub repository
- Click on "Actions" tab
- View workflow runs and logs

## 🔍 **Troubleshooting**

### **Common Issues**

1. **Authentication Errors**
   - Verify Google OAuth credentials are correct
   - Check that Google Fit API is enabled
   - Ensure OAuth consent screen is configured

2. **Firebase Permission Errors**
   - Check Firestore security rules
   - Ensure your Firebase project is properly configured

3. **API Key Errors**
   - Verify API_SECRET_KEY matches in all places
   - Check environment variables are set correctly

### **Debug Mode**
Add console.log statements in your API functions to debug:
```javascript
console.log('Starting sync for user:', user.uid);
console.log('Google Fit response:', response.data);
```

## 🎉 **You're All Set!**

Once deployed, your team competition features will:
- ✅ Automatically sync Google Fit data every 6 hours
- ✅ Update monthly leaderboards daily
- ✅ Work completely free without Firebase Functions billing
- ✅ Handle team management and invitations
- ✅ Display real-time leaderboards

## 📞 **Need Help?**

If you encounter any issues:
1. Check the logs in your chosen platform (Vercel/GitHub)
2. Verify all environment variables are set correctly
3. Test the API endpoints manually
4. Check Firebase console for any permission issues

Your team competition feature is now ready to go! 🚀
