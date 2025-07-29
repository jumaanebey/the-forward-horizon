#!/bin/bash

# Forward Horizon Deployment Script
echo "🚀 Forward Horizon Deployment Script"
echo "======================================"

# Check if Vercel CLI is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js"
    exit 1
fi

# Step 1: Login to Vercel (if not already logged in)
echo "📝 Step 1: Checking Vercel login status..."
if ! npx vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel:"
    npx vercel login
    if [ $? -ne 0 ]; then
        echo "❌ Vercel login failed"
        exit 1
    fi
fi

echo "✅ Vercel login successful"

# Step 2: Ensure we're in the right directory
cd "$(dirname "$0")"
echo "📁 Current directory: $(pwd)"

# Step 3: Build the project
echo "🏗️  Step 2: Building the project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors above."
    exit 1
fi

echo "✅ Build successful"

# Step 4: Deploy to Vercel
echo "🚀 Step 3: Deploying to Vercel..."
npx vercel --prod
if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo ""
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "=========================="
echo ""
echo "🔗 Your app should now be live at the URL shown above"
echo ""
echo "📋 Next Steps:"
echo "1. Add custom domain in Vercel dashboard"
echo "2. Set up Supabase database (see DEPLOYMENT_INSTRUCTIONS.md)"
echo "3. Configure email service"
echo "4. Launch marketing campaigns"
echo ""
echo "📖 For detailed setup: cat DEPLOYMENT_INSTRUCTIONS.md"
echo ""