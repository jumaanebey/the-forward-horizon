#!/bin/bash

# ⚡ Quick Deployment Script
# For rapid deployments without full testing

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}⚡ Quick Deploy Starting...${NC}"

# Quick build check
npm run build

# Commit and push
git add .
git commit -m "⚡ Quick Deploy: $(date)"
git push origin main

echo -e "${GREEN}✅ Quick deploy completed!${NC}"
echo "🚀 Vercel will auto-deploy from the push" 