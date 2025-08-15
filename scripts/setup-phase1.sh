#!/bin/bash

# Forward Horizon - Phase 1 Setup Script
# This script helps configure the environment for Phase 1 deployment

echo "🚀 Forward Horizon - Phase 1 Setup"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found. Creating from template..."
    cp env.example .env.local
    echo "✅ .env.local created from template"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local with your actual configuration values"
    echo "   - Supabase URL and keys"
    echo "   - Gmail credentials"
    echo "   - Stripe API keys"
    echo ""
fi

# Check Node.js version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check npm version
echo "📋 Checking npm version..."
NPM_VERSION=$(npm --version)
echo "✅ npm version: $NPM_VERSION"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if build works
echo ""
echo "🔨 Testing build..."
if npm run build; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Check environment variables
echo ""
echo "🔍 Checking environment configuration..."

# Function to check if env var is set
check_env_var() {
    local var_name=$1
    local var_value=$(grep "^$var_name=" .env.local | cut -d'=' -f2)
    
    if [ -z "$var_value" ] || [[ "$var_value" == *"your-"* ]]; then
        echo "❌ $var_name: Not configured (using placeholder)"
        return 1
    else
        echo "✅ $var_name: Configured"
        return 0
    fi
}

echo "Checking Supabase configuration..."
check_env_var "NEXT_PUBLIC_SUPABASE_URL"
check_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY"

echo ""
echo "Checking Email configuration..."
check_env_var "EMAIL_USER"
check_env_var "EMAIL_PASSWORD"

echo ""
echo "Checking Stripe configuration..."
check_env_var "STRIPE_SECRET_KEY"
check_env_var "STRIPE_PUBLISHABLE_KEY"

echo ""
echo "📋 Setup Summary"
echo "================"
echo "✅ Dependencies installed"
echo "✅ Build successful"
echo ""
echo "🔧 Next Steps:"
echo "1. Configure your .env.local file with real values"
echo "2. Set up Supabase database (run supabase-production-setup.sql)"
echo "3. Configure Stripe webhooks"
echo "4. Set up Gmail app password"
echo "5. Test the application"
echo ""
echo "📖 For detailed instructions, see PHASE_1_SETUP_GUIDE.md"
echo ""
echo "🎉 Phase 1 setup script completed!"
