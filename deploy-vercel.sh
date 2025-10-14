#!/bin/bash

# FitSpark-2 Vercel Deployment Script

echo "🚀 Starting FitSpark-2 deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Building the project..."
npm run build

echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Add environment variables:"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET" 
echo "   - API_SECRET_KEY"
echo "3. Redeploy with: vercel --prod"
echo ""
echo "🎉 Your FitSpark team competition app is now live!"
