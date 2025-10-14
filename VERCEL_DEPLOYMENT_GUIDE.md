# Vercel Deployment Guide for FitSpark-2

This guide will help you deploy your FitSpark team competition app to Vercel with automatic Google Fit sync and leaderboard updates.

## 🚀 **Quick Deployment Steps**

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**
```bash
vercel login
```

### **Step 3: Deploy Your App**
```bash
# In your project root directory
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Choose your account
- **Link to existing project?** → No (for first deployment)
- **Project name?** → `fitspark-2` (or your preferred name)
- **Directory?** → `./` (current directory)

### **Step 4: Set Environment Variables**
After deployment, go to your Vercel dashboard and add these environment variables:

**Required Environment Variables:**
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
API_SECRET_KEY=your-secret-key-for-api-auth
```

**Optional Environment Variables:**
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_API_KEY=your-google-api-key
VITE_API_SECRET_KEY=your-secret-key-for-api-auth
```

### **Step 5: Redeploy with Environment Variables**
```bash
vercel --prod
```

## 🔧 **Project Structure for Vercel**

Your project should have this structure:
```
fitspark-2/
├── apps/
│   └── web/                 # Your React app
│       ├── src/
│       ├── package.json
│       └── vercel.json      # Vercel config for web app
├── api/                     # Serverless functions
│   ├── sync-google-fit.js
│   ├── update-leaderboards.js
│   └── package.json
├── vercel.json              # Main Vercel config
└── package.json
```

## 📋 **Vercel Configuration Explained**

### **Main vercel.json**
- **Builds**: Configures both your React app and API functions
- **Routes**: Routes API calls to functions, everything else to your React app
- **Crons**: Automatically runs your functions on schedule
- **Environment**: Sets your Firebase config

### **Web App vercel.json**
- **Framework**: Tells Vercel this is a Vite app
- **Build Command**: How to build your React app
- **Output Directory**: Where the built files are located

## 🔄 **Automatic Scheduling**

Your functions will automatically run:
- **Google Fit Sync**: Every 6 hours (`0 */6 * * *`)
- **Leaderboard Updates**: Daily at midnight UTC (`0 0 * * *`)

## 🧪 **Testing Your Deployment**

### **Test 1: Check Your App**
Visit your Vercel URL (e.g., `https://fitspark-2.vercel.app`)

### **Test 2: Test API Functions**
```bash
# Test Google Fit sync (replace with your actual URL)
curl -X POST https://fitspark-2.vercel.app/api/sync-google-fit \
  -H "Authorization: Bearer your-api-secret-key"

# Test leaderboard update
curl -X POST https://fitspark-2.vercel.app/api/update-leaderboards \
  -H "Authorization: Bearer your-api-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"month": "December", "year": 2024}'
```

### **Test 3: Check Function Logs**
1. Go to your Vercel dashboard
2. Click on "Functions" tab
3. View logs for your API functions

## 🔍 **Monitoring and Debugging**

### **Vercel Dashboard**
- **Functions**: View function logs and metrics
- **Analytics**: Monitor app performance
- **Deployments**: Track deployment history

### **Function Logs**
```bash
# View function logs
vercel logs https://fitspark-2.vercel.app/api/sync-google-fit
```

### **Local Development**
```bash
# Run Vercel locally
vercel dev
```

## 🛠️ **Google Cloud Console Setup**

### **Step 1: Create OAuth 2.0 Credentials**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google Fit API**
4. Go to APIs & Services → Credentials
5. Create OAuth 2.0 Client ID
6. Add authorized redirect URIs:
   - `https://fitspark-2.vercel.app` (your Vercel URL)
   - `http://localhost:3000` (for local development)

### **Step 2: Configure OAuth Consent Screen**
1. Go to OAuth consent screen
2. Fill in required information
3. Add scopes:
   - `https://www.googleapis.com/auth/fitness.activity.read`
   - `https://www.googleapis.com/auth/fitness.body.read`

## 🔐 **Security Best Practices**

### **API Secret Key**
Generate a strong secret key for API authentication:
```bash
# Generate a random secret key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Environment Variables**
- Never commit API keys to version control
- Use Vercel's environment variables for sensitive data
- Rotate keys regularly

## 📊 **Performance Optimization**

### **Function Optimization**
- Functions have a 60-second timeout
- Optimize for quick execution
- Use efficient Firebase queries

### **Caching**
- Vercel automatically caches static assets
- Consider implementing API response caching

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Build Failures**
   ```bash
   # Check build logs
   vercel logs --build
   ```

2. **Function Timeouts**
   - Check function execution time
   - Optimize database queries
   - Consider breaking into smaller functions

3. **Environment Variable Issues**
   - Verify all variables are set in Vercel dashboard
   - Check variable names match exactly
   - Redeploy after adding new variables

4. **Firebase Permission Errors**
   - Check Firestore security rules
   - Verify Firebase project configuration
   - Ensure API keys are correct

### **Debug Mode**
Add logging to your functions:
```javascript
console.log('Starting sync for user:', user.uid);
console.log('Google Fit response:', response.data);
```

## 🎯 **Next Steps After Deployment**

1. **Test all features**:
   - User registration/login
   - Team creation and management
   - Google Fit connection
   - Leaderboard display

2. **Monitor performance**:
   - Check function execution times
   - Monitor error rates
   - Review user feedback

3. **Set up monitoring**:
   - Configure alerts for function failures
   - Monitor API usage
   - Track user engagement

## 🎉 **You're All Set!**

Your FitSpark team competition app is now deployed on Vercel with:
- ✅ Automatic Google Fit data sync every 6 hours
- ✅ Daily leaderboard updates
- ✅ Team management features
- ✅ Real-time competition tracking
- ✅ Completely free hosting and functions

## 📞 **Need Help?**

If you encounter issues:
1. Check Vercel dashboard logs
2. Verify environment variables
3. Test API endpoints manually
4. Review Firebase console for errors

Your team competition feature is ready to go! 🚀
