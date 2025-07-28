# Firebase Auth Setup for Staging

This guide helps you configure Firebase Authentication for the FitSpark staging environment.

## 🔑 **Current Issues & Solutions**

### Problem: Auth not working on deployed staging

**Root Cause:** Firebase Auth needs to be properly configured with authorized domains.

## 🛠️ **Step-by-Step Fix**

### 1. **Enable Authentication in Firebase Console**

1. Go to: https://console.firebase.google.com/project/fitspark-staging/authentication
2. Click **"Get started"** if not already enabled
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"** provider:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

### 2. **Configure Authorized Domains**

1. In Firebase Console → Authentication → Settings → **Authorized domains**
2. Add these domains:

   ```
   localhost                    (for local development)
   fitspark-staging.web.app     (default Firebase hosting)
   fitspark-staging.firebaseapp.com  (custom domain if used)
   ```

3. **If using custom domain**, add your domain too:
   ```
   yourdomain.com
   staging.yourdomain.com
   ```

### 3. **Verify Environment Variables**

Check that `apps/web/.env.staging` has correct values:

```env
VITE_FIREBASE_API_KEY=AIzaSyCEwPpL6Om4k5uvtgt2jWi--IcIEXq-ZPQ
VITE_FIREBASE_AUTH_DOMAIN=fitspark-staging.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fitspark-staging
VITE_FIREBASE_STORAGE_BUCKET=fitspark-staging.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=781274816005
VITE_FIREBASE_APP_ID=1:781274816005:web:081464c33a1afa416e466c
VITE_FIREBASE_MEASUREMENT_ID=G-P9Y0SCVENL
```

### 4. **Test Authentication Flow**

1. **Build and deploy:**

   ```bash
   pnpm run build --filter=@fitspark/web
   firebase deploy --only hosting
   ```

2. **Test the flow:**
   - Go to your staging URL
   - Click "Get Started" → Sign Up
   - Enter email/password
   - Should create account successfully
   - Try logging out and logging back in

### 5. **Debug Common Issues**

#### Issue: "Firebase: Error (auth/unauthorized-domain)"

**Solution:** Add your deployment domain to authorized domains (Step 2)

#### Issue: "Firebase: Error (auth/configuration-not-found)"

**Solution:** Verify environment variables are correct (Step 3)

#### Issue: "Firebase: Error (auth/invalid-api-key)"

**Solution:** Check API key in Firebase Console → Project Settings → General

#### Issue: Auth works locally but not on staging

**Solution:** Make sure environment variables are available during build

## 🚀 **Deploy with Correct Environment**

### For Staging Deployment:

```bash
# Make sure we're using staging project
firebase use fitspark-staging

# Build with staging environment
cp apps/web/.env.staging apps/web/.env.local
pnpm run build --filter=@fitspark/web

# Deploy
firebase deploy --only hosting
```

### For Local Development:

```bash
# Use development environment
cp apps/web/.env.development apps/web/.env.local
pnpm run dev --filter=@fitspark/web
```

## ✅ **Verification Checklist**

- [ ] Firebase Authentication is enabled
- [ ] Email/Password provider is enabled
- [ ] Authorized domains include your staging URL
- [ ] Environment variables are correct
- [ ] Build uses correct environment file
- [ ] Can sign up new user on staging
- [ ] Can log in existing user on staging
- [ ] Can log out successfully
- [ ] Protected routes redirect to login when not authenticated

## 🔍 **Additional Security (Optional)**

### Email Verification

1. In Firebase Console → Authentication → Templates
2. Customize email verification template
3. Enable in your app:

   ```typescript
   import { sendEmailVerification } from "firebase/auth";

   // After signup
   await sendEmailVerification(user);
   ```

### Password Reset

Already implemented in login page. Users can reset password via:

1. Click "Forgot Password" on login page
2. Enter email
3. Receive reset email
4. Follow link to reset

## 📞 **Still Having Issues?**

1. Check browser console for specific Firebase errors
2. Verify network tab shows successful auth requests
3. Check Firebase Console → Authentication → Users to see if accounts are being created
4. Review Firestore rules to ensure they allow authenticated access

## 🎯 **Next Steps After Auth is Working**

1. Test complete user flow: signup → dashboard → plan selection
2. Verify Firestore security rules are working
3. Test plan selection and dashboard features
4. Deploy to production when ready
