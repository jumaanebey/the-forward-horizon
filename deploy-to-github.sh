#!/bin/bash

# Forward Horizon - GitHub Pages Deployment Script
# This script helps deploy the SEO and PWA files to GitHub Pages

echo "🚀 Forward Horizon - GitHub Pages Deployment"
echo "============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized."
    echo "Please run: git init"
    exit 1
fi

# Check if we have the files
echo "📁 Checking files..."
files=("public/sitemap.xml" "public/robots.txt" "public/manifest.json" "public/sw.js" "public/pwa-register.js")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ Found: $file"
    else
        echo "❌ Missing: $file"
        exit 1
    fi
done

# Copy files to root directory for GitHub Pages
echo "📋 Copying files to root directory..."
cp public/sitemap.xml ./
cp public/robots.txt ./
cp public/manifest.json ./
cp public/sw.js ./
cp public/pwa-register.js ./

# Add files to git
echo "📝 Adding files to git..."
git add sitemap.xml robots.txt manifest.json sw.js pwa-register.js

# Commit changes
echo "💾 Committing changes..."
git commit -m "Add SEO and PWA files for theforwardhorizon.com

- Fixed sitemap.xml with correct domain
- Updated robots.txt for SEO
- Added PWA manifest and service worker
- Added PWA registration script"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Deployment completed!"
echo ""
echo "📊 Next steps:"
echo "1. Wait 2-5 minutes for GitHub Pages to deploy"
echo "2. Check your site: https://theforwardhorizon.com"
echo "3. Verify files are accessible:"
echo "   - https://theforwardhorizon.com/sitemap.xml"
echo "   - https://theforwardhorizon.com/robots.txt"
echo "   - https://theforwardhorizon.com/manifest.json"
echo ""
echo "🔍 To verify deployment, run:"
echo "curl https://theforwardhorizon.com/sitemap.xml"
echo ""
echo "📱 PWA features will be available after adding the script to your HTML" 