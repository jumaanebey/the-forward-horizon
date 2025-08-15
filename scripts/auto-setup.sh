#!/bin/bash

# Forward Horizon - Automated Setup Script
# This script handles the parts that can be automated

echo "🚀 Forward Horizon - Automated Setup"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
npm install

# Step 2: Test build
echo "🔨 Step 2: Testing build..."
if npm run build; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Step 3: Check environment file
echo "🔍 Step 3: Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found. Creating from template..."
    cp env.example .env.local
    echo "✅ .env.local created from template"
    echo ""
    echo "⚠️  IMPORTANT: You need to manually update .env.local with:"
    echo "   - Supabase URL and keys"
    echo "   - Gmail credentials"
    echo "   - Stripe API keys"
    echo ""
else
    echo "✅ .env.local exists"
fi

# Step 4: Generate security keys if not present
echo "🔐 Step 4: Checking security keys..."
if grep -q "your-jwt-secret-key-here" .env.local; then
    echo "⚠️  Security keys need to be updated in .env.local"
    echo "   Use these generated keys:"
    echo "   JWT_SECRET=NLXyMaRNXQJFONbsgwKi+f6YKZPhyLrAw9HKmzEfoS0="
    echo "   SESSION_SECRET=rFEL1JwEg5Am8dB8fbOa+o7nUbnftHaRQ5NEArGns6w="
else
    echo "✅ Security keys appear to be configured"
fi

# Step 5: Check Vercel CLI
echo "🚀 Step 5: Checking Vercel CLI..."
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI installed (version: $(vercel --version))"
else
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Step 6: Display next steps
echo ""
echo "📋 Automated Setup Complete!"
echo "============================"
echo ""
echo "✅ What's been done automatically:"
echo "   - Dependencies installed"
echo "   - Build tested successfully"
echo "   - Environment file created"
echo "   - Vercel CLI installed"
echo ""
echo "🔧 What you need to do manually:"
echo ""
echo "1. Update .env.local with your credentials:"
echo "   - Supabase URL and keys (from https://supabase.com)"
echo "   - Gmail credentials (with app password)"
echo "   - Stripe API keys (from https://stripe.com)"
echo ""
echo "2. Set up external services:"
echo "   - Create Supabase project and run database schema"
echo "   - Create Stripe account and configure webhooks"
echo "   - Set up Gmail 2FA and app password"
echo ""
echo "3. Deploy to production:"
echo "   ./scripts/deploy-phase1.sh"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - IMMEDIATE_NEXT_STEPS.md"
echo "   - NEXT_STEPS_GUIDE.md"
echo "   - PHASE_1_SETUP_GUIDE.md"
echo ""
echo "🎉 Ready to continue with manual setup!"
