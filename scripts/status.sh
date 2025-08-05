#!/bin/bash

# 📊 Status Check Script
# Shows current project status

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}📊 Project Status Check${NC}"
echo -e "${BLUE}================================${NC}"

# Git Status
echo -e "\n${CYAN}📋 Git Status:${NC}"
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes:${NC}"
    git status --short
else
    echo -e "${GREEN}✅ Working directory is clean${NC}"
fi

# Recent Commits
echo -e "\n${CYAN}📊 Recent Commits:${NC}"
git log --oneline -5

# Build Status
echo -e "\n${CYAN}🏗️ Build Status:${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
fi

# Dependencies
echo -e "\n${CYAN}📦 Dependencies:${NC}"
if [[ -d "node_modules" ]]; then
    echo -e "${GREEN}✅ node_modules exists${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules missing - run npm install${NC}"
fi

# Production URL
echo -e "\n${CYAN}🌐 Production URL:${NC}"
echo "https://tenant-portal-mgume5fpp-jumaane-beys-projects.vercel.app"

# Vercel Status
echo -e "\n${CYAN}🔧 Vercel Status:${NC}"
if command -v vercel &> /dev/null; then
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
else
    echo -e "${YELLOW}⚠️  Vercel CLI not installed${NC}"
fi

echo -e "\n${BLUE}================================${NC}" 