@echo off
echo 🚀 Starting FitSpark-2 deployment to Vercel...

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
echo 📋 Next steps:
echo 1. Go to your Vercel dashboard
echo 2. Add environment variables:
echo    - GOOGLE_CLIENT_ID
echo    - GOOGLE_CLIENT_SECRET
echo    - API_SECRET_KEY
echo 3. Redeploy with: vercel --prod
echo.
echo 🎉 Your FitSpark team competition app is now live!
pause
