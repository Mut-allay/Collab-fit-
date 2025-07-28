# Environment Setup Guide - FitSpark

## 🔧 **Environment Configuration**

### **Issue Resolved**

The login issue was caused by using the wrong Firebase configuration. The app was built with production mode instead of staging mode, causing it to use the production Firebase project instead of staging.

### **Environment Files**

#### **Staging Environment** (`apps/web/.env.staging`)

```bash
VITE_FIREBASE_API_KEY=AIzaSyCEwPpL6Om4k5uvtgt2jWi--IcIEXq-ZPQ
VITE_FIREBASE_AUTH_DOMAIN=fitspark-staging.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fitspark-staging
VITE_FIREBASE_STORAGE_BUCKET=fitspark-staging.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=781274816005
VITE_FIREBASE_APP_ID=1:781274816005:web:081464c33a1afa416e466c
VITE_FIREBASE_MEASUREMENT_ID=G-P9Y0SCVENL
```

#### **Production Environment** (`apps/web/.env.production`)

```bash
VITE_FIREBASE_API_KEY=AIzaSyBAZn6y3A-T73ZB2JRGhnny7j0hFe96ag8
VITE_FIREBASE_AUTH_DOMAIN=fitspark-production.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fitspark-production
VITE_FIREBASE_STORAGE_BUCKET=fitspark-production.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=265586705069
VITE_FIREBASE_APP_ID=1:265586705069:web:946b71978b7b60be7cfc24
VITE_FIREBASE_MEASUREMENT_ID=G-YRBXWNXHHF
```

## 🚀 **Build Commands**

### **For Staging Deployment**

```bash
cd apps/web
pnpm build:staging
cd ../..
firebase deploy --only hosting
```

### **For Production Deployment**

```bash
cd apps/web
pnpm build:production
cd ../..
firebase deploy --only hosting --project production
```

## 🔍 **Troubleshooting**

### **Login Issues**

If users can't log in, check:

1. **Build Mode**: Ensure you're using the correct build mode
   - Staging: `pnpm build:staging`
   - Production: `pnpm build:production`

2. **Firebase Project**: Verify the correct project is being used
   - Staging: `fitspark-staging`
   - Production: `fitspark-production`

3. **Environment Variables**: Check that the correct `.env` file is being loaded

### **Debug Configuration**

The app logs Firebase configuration in development/staging mode:

```javascript
console.log("🔥 Firebase Config Debug:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAppId: !!firebaseConfig.appId,
});
```

## 📋 **Deployment Checklist**

### **Before Deploying to Staging**

- [ ] Use `pnpm build:staging`
- [ ] Verify staging Firebase project is configured
- [ ] Test login functionality
- [ ] Check all features work with staging data

### **Before Deploying to Production**

- [ ] Use `pnpm build:production`
- [ ] Verify production Firebase project is configured
- [ ] Test login functionality
- [ ] Check all features work with production data

## 🎯 **Current Status**

- ✅ **Staging**: Fixed and deployed with correct configuration
- ✅ **Production**: Ready for deployment when needed
- ✅ **Login**: Working on both environments

---

**Last Updated**: January 2025
**Status**: ✅ Resolved
