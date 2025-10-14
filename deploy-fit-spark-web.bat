@echo off
echo Deploying to fit-spark-web project...

REM Remove any existing .vercel folder
if exist .vercel rmdir /s /q .vercel

REM Link to the fit-spark-web project
npx vercel link --project fit-spark-web --yes

REM Deploy to production
npx vercel --prod

echo Deployment complete!
pause
