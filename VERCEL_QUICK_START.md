# 🚀 Vercel Quick Start for FitSpark-2

## **Ready to Deploy? Follow These Steps:**

### **1. Install Vercel CLI**
```bash
npm install -g vercel
```

### **2. Login to Vercel**
```bash
vercel login
```

### **3. Deploy Your App**
```bash
# Option A: Use the deployment script (Windows)
deploy-vercel.bat

# Option B: Manual deployment
vercel
```

### **4. Set Environment Variables**
After deployment, go to your Vercel dashboard and add:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
API_SECRET_KEY=your-secret-key-for-api-auth
```

### **5. Redeploy**
```bash
vercel --prod
```

## **🎯 What You'll Get:**

✅ **Your React app** deployed at `https://fitspark-2.vercel.app`
✅ **API functions** at `/api/sync-google-fit` and `/api/update-leaderboards`
✅ **Automatic scheduling**:
- Google Fit sync every 6 hours
- Leaderboard updates daily at midnight
✅ **Team competition features** working without Firebase Functions billing

## **🔧 Google Cloud Setup:**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Google Fit API**
3. Create **OAuth 2.0 credentials**
4. Add redirect URI: `https://fitspark-2.vercel.app`
5. Copy Client ID and Secret to Vercel environment variables

## **📱 Your App Features:**

- 👥 **Team Management**: Create teams, invite members, manage roles
- 🏃 **Google Fit Integration**: Automatic step and calorie tracking
- 🏆 **Monthly Competitions**: Teams compete on steps and calories
- 📊 **Real-time Leaderboards**: Live rankings and member stats
- 🔔 **Notifications**: Team invitations and updates
- 📱 **Responsive Design**: Works on all devices

## **🎉 That's It!**

Your FitSpark team competition app is now live and ready for users to start competing! 🚀
