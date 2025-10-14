@echo off
echo 🚀 Deploying FitSpark-2 to Vercel (Hobby Account Optimized)...

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Check if user is logged in
vercel whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 🔐 Please login to Vercel...
    vercel login
)

echo 📦 Installing dependencies...
npm install

echo 🔧 Building the project...
npm run build

echo 🚀 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo.
echo 📋 IMPORTANT: Vercel Hobby Account Limitations
echo.
echo ⚠️  Your cron jobs are limited to DAILY only:
echo    - Google Fit Sync: Daily at noon UTC
echo    - Leaderboard Updates: Daily at midnight UTC
echo.
echo 💡 Solutions:
echo    1. Use manual sync buttons in your app
echo    2. Set up GitHub Actions for more frequent sync
echo    3. Upgrade to Vercel Pro for unlimited cron jobs
echo.
echo 🎯 Next steps:
echo    1. Go to your Vercel dashboard
echo    2. Add environment variables:
echo       - GOOGLE_CLIENT_ID
echo       - GOOGLE_CLIENT_SECRET
echo       - API_SECRET_KEY
echo    3. Redeploy with: vercel --prod
echo.
echo 🎉 Your FitSpark team competition app is now live!
echo    Users can use manual sync buttons for immediate updates.
pause
