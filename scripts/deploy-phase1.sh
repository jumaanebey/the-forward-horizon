#!/bin/bash

# Forward Horizon - Phase 1 Deployment Script
# This script deploys the application to Vercel

echo "🚀 Forward Horizon - Phase 1 Deployment"
echo "======================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local not found. Please run setup-phase1.sh first."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "🔨 Building project..."
if ! npm run build; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo ""
echo "🚀 Deploying to Vercel..."
echo "This will open a browser window for authentication and configuration."

# Check if already linked to a Vercel project
if [ -f ".vercel/project.json" ]; then
    echo "📋 Project already linked to Vercel. Deploying..."
    vercel --prod
else
    echo "🔗 Linking to Vercel project..."
    vercel
fi

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Configure environment variables in Vercel dashboard"
echo "2. Set up custom domain (optional)"
echo "3. Configure Stripe webhooks with production URL"
echo "4. Test all functionality"
echo ""
echo "📖 For detailed instructions, see PHASE_1_SETUP_GUIDE.md"
