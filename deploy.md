# FitSpark Deployment Guide

This guide covers everything needed to deploy FitSpark to Firebase hosting. FitSpark uses a simplified architecture with Firebase client SDK only - no backend API layer required!

## 📋 Prerequisites

- Node.js 18+ installed
- PNPM installed (`npm install -g pnpm`)
- Google Cloud account
- Firebase CLI installed globally

## 🔧 Initial Setup

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Create Firebase Projects

You'll need two Firebase projects:

- **Production**: `fitspark-prod`
- **Development**: `fitspark-dev`

#### Create Projects in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Create `fitspark-prod` for production
4. Create `fitspark-dev` for development/staging

### 4. Initialize Firebase in Your Project

From the project root:

```bash
# Initialize Firebase (choose existing projects)
firebase init

# Select the following services:
# ✅ Firestore
# ✅ Hosting
# ✅ Storage
# ✅ Emulators

# When prompted:
# - Choose existing projects: fitspark-dev (default) and fitspark-prod
# - Firestore rules: firestore.rules
# - Firestore indexes: firestore.indexes.json
# - Hosting public directory: apps/web/dist
# - Configure as SPA: Yes
# - GitHub deploys: No (we'll use GitHub Actions)
# - Storage rules: storage.rules
```

## 🔐 Firebase Project Configuration

### 1. Enable Authentication

For each project (dev and prod):

```bash
# Switch to development project
firebase use fitspark-dev

# Enable Auth providers via Firebase Console or CLI
firebase auth:import --help
```

**In Firebase Console:**

1. Go to Authentication → Sign-in method
2. Enable Email/Password
3. Enable Google (optional)
4. Enable Apple (optional, for mobile)

### 2. Configure Firestore

```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules,firestore:indexes
```

### 3. Configure Storage

```bash
# Deploy Storage rules
firebase deploy --only storage
```

### 4. Set up Environment Variables

Create Firebase config for your web app:

1. Go to Project Settings → General
2. Add a web app
3. Copy the config object

Create environment files:

**`.env.development`** (for local development):

```bash
VITE_FIREBASE_API_KEY=your_dev_api_key
VITE_FIREBASE_AUTH_DOMAIN=fitspark-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fitspark-dev
VITE_FIREBASE_STORAGE_BUCKET=fitspark-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**`.env.production`** (for production):

```bash
VITE_FIREBASE_API_KEY=your_prod_api_key
VITE_FIREBASE_AUTH_DOMAIN=fitspark-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fitspark-prod
VITE_FIREBASE_STORAGE_BUCKET=fitspark-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🏗️ Build Process

### 1. Install Dependencies

```bash
# Install all monorepo dependencies
pnpm install
```

### 2. Build Shared Package

```bash
# Build shared schemas and types
pnpm run build --filter=@fitspark/shared
```

### 3. Build Web Application

```bash
# Build the React frontend
pnpm run build --filter=@fitspark/web
```

## 🚀 Deployment Commands

### Development Deployment

```bash
# Switch to development project
firebase use fitspark-dev

# Build everything
pnpm run build

# Deploy to development
pnpm run deploy
```

### Production Deployment

```bash
# Switch to production project
firebase use fitspark-prod

# Build everything
pnpm run build

# Deploy to production
pnpm run deploy
```

### Deploy Specific Services

#### Hosting Only

```bash
# Build and deploy only hosting
pnpm run deploy:hosting
```

#### Firestore Rules Only

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

#### Storage Rules Only

```bash
firebase deploy --only storage
```

## 🔄 Continuous Deployment

### GitHub Actions Setup

1. **Generate Firebase Token**:

   ```bash
   firebase login:ci
   ```

   Copy the token for GitHub secrets.

2. **Add GitHub Secrets**:
   - Go to your GitHub repo → Settings → Secrets
   - Add `FIREBASE_TOKEN` with the token from step 1
   - Add environment variables if needed

3. **Deployment Workflow**:
   Our CI/CD pipeline in `.github/workflows/ci.yml` handles:
   - ✅ Lint and typecheck
   - ✅ Build all packages
   - ✅ Deploy preview on PRs
   - ✅ Deploy production on main branch

## 🧪 Local Development with Emulators

### Start Firebase Emulators

```bash
# Start all emulators
firebase emulators:start

# Or start specific emulators
firebase emulators:start --only firestore,auth,hosting
```

### Run Development Server

```bash
# Start the web app with hot reloading
pnpm run dev --filter=@fitspark/web

# In another terminal, watch functions changes
pnpm run dev --filter=@fitspark/functions
```

**Emulator URLs:**

- **Auth Emulator**: http://localhost:9099
- **Firestore Emulator**: http://localhost:8080
- **Hosting Emulator**: http://localhost:5000
- **Emulator UI**: http://localhost:4000

## 🔍 Deployment Verification

### 1. Check Deployment Status

```bash
# View recent deployments
firebase projects:list

# Check hosting URLs
firebase hosting:sites:list
```

### 2. Test Functions

```bash
# Test a function locally
curl http://localhost:5001/fitspark-dev/us-central1/api/user.getProfile

# Test deployed function
curl https://us-central1-fitspark-dev.cloudfunctions.net/api/user.getProfile
```

### 3. Monitor Logs

```bash
# View function logs
firebase functions:log

# Follow logs in real-time
firebase functions:log --follow
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Workspace Protocol Error

```bash
# If you see workspace protocol errors, ensure you're using our custom script:
node scripts/prepare-deploy.js
```

#### 2. Build Failures

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm run build
```

#### 3. Function Deployment Timeout

```bash
# Increase timeout
firebase deploy --only functions --timeout 600s
```

#### 4. CORS Issues

```bash
# Check CORS configuration in functions/src/index.ts
# Ensure proper origin configuration for your domain
```

### Debug Mode

```bash
# Deploy with debug logging
firebase deploy --debug

# Emulators with debug
firebase emulators:start --debug
```

## 📦 Production Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] Firebase security rules tested
- [ ] All tests passing
- [ ] Performance optimizations applied
- [ ] Analytics/monitoring configured
- [ ] Error logging (Sentry) configured
- [ ] CDN/caching configured
- [ ] SSL certificates verified
- [ ] Custom domain configured (if applicable)

## 🔒 Security Notes

1. **Never commit** `.env` files or Firebase config with secrets
2. **Use Firebase App Check** for additional security
3. **Rotate service account keys** regularly
4. **Monitor Firebase usage** and set up billing alerts
5. **Review security rules** before production deployment

## 📚 Useful Commands Reference

```bash
# Project management
firebase projects:list
firebase use <project-id>
firebase use --add  # Add another project alias

# Functions
firebase functions:shell
firebase functions:log --follow
firebase functions:delete <function-name>

# Hosting
firebase hosting:sites:list
firebase hosting:clone <source-site-id> <target-site-id>

# Firestore
firebase firestore:delete --recursive <path>
firebase firestore:indexes

# Auth
firebase auth:export users.json
firebase auth:import users.json

# Storage
firebase storage:rules:get
firebase storage:rules:put storage.rules
```

---

## 🎉 Success!

If you've followed this guide, FitSpark should now be deployed and running on Firebase!

**Production URL**: `https://fitspark-prod.web.app`  
**Development URL**: `https://fitspark-dev.web.app`

For any deployment issues, check the [Firebase Console](https://console.firebase.google.com) and review the function logs.
