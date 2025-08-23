#!/bin/bash

# Claude Code Session Startup Script for Forward Horizon
# Run this at the beginning of every Claude Code session

echo "🤖 Claude Code Forward Horizon Session Startup"
echo "==============================================="

# Check if we're in the right directory
if [ ! -f "DEPLOYMENT_MAPPING.md" ]; then
    echo "❌ Error: Not in Forward Horizon project directory"
    echo "Please navigate to /Users/jumaanebey/Documents/forward-horizon-app/"
    exit 1
fi

echo "✅ In correct project directory"

# Display critical warnings
echo ""
echo "🚨 CRITICAL REMINDERS:"
echo "====================="
echo "1. NEVER make changes without verifying deployment source"
echo "2. theforwardhorizon.com source is UNKNOWN - find it before changes"
echo "3. Always use test identifiers to verify repository connections"
echo "4. Update DEPLOYMENT_MAPPING.md after any discoveries"

# Show current domain status
echo ""
echo "📊 Current Domain Status:"
echo "========================"
echo "theforwardhorizon.com: ❌ UNKNOWN SOURCE"
echo "Phone Number: ❌ INCORRECT (626) 603-0954"
echo "Should Show: (310) 488-5280"

# Show available tools
echo ""
echo "🛠 Available Tools:"
echo "=================="
echo "• Read deployment mapping: cat DEPLOYMENT_MAPPING.md"
echo "• Run verification: ./scripts/verify-deployments.sh"
echo "• Change protocol: cat CHANGE_MANAGEMENT_PROTOCOL.md"

# Show next steps
echo ""
echo "🎯 If Working on Phone Number Issue:"
echo "===================================="
echo "1. DO NOT make random changes to repositories"
echo "2. First find which repository serves theforwardhorizon.com"
echo "3. Use test identifier method to verify"
echo "4. Update DEPLOYMENT_MAPPING.md with findings"
echo "5. Then fix phone number in correct source"

# Check for any urgent issues
echo ""
echo "⚡ Quick Status Check:"
echo "====================="

# Check if domain is still serving wrong phone number
echo -n "Live site phone number: "
if curl -s https://www.theforwardhorizon.com/ | grep -q "(626) 603-0954"; then
    echo "❌ Still shows (626) 603-0954"
    echo "   Action needed: Find correct repository and fix"
else
    echo "✅ May be fixed - verify manually"
fi

echo ""
echo "📚 Required Reading Before Any Changes:"
echo "======================================="
echo "1. DEPLOYMENT_MAPPING.md"
echo "2. CHANGE_MANAGEMENT_PROTOCOL.md"  
echo "3. CLAUDE.md"

echo ""
echo "🚦 Remember: Verify first, then change!"
echo "========================================"