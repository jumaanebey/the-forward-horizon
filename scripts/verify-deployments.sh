#!/bin/bash

# Forward Horizon Deployment Verification Script
# Ensures domain-to-repository mapping is correct before making changes

echo "🔍 Forward Horizon Deployment Verification"
echo "=========================================="

# Configuration
DOMAIN="theforwardhorizon.com"
TEST_IDENTIFIER="DEPLOYMENT_TEST_$(date +%Y_%m_%d_%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "\n📋 Step 1: DNS and Hosting Check"
echo "Domain: $DOMAIN"

# Check DNS
echo -n "DNS Resolution: "
DNS_IP=$(dig +short $DOMAIN | head -1)
echo "$DNS_IP"

# Check hosting provider
echo -n "Hosting Provider: "
if [[ $DNS_IP == 76.76.21.* ]]; then
    echo -e "${GREEN}Vercel${NC}"
else
    echo -e "${YELLOW}Unknown${NC}"
fi

# Check headers
echo -e "\n🌐 Step 2: Server Headers"
curl -I https://www.$DOMAIN/ 2>/dev/null | grep -i "server\|x-vercel\|x-matched"

echo -e "\n🧪 Step 3: Repository Verification"
echo "To verify which repository serves this domain:"
echo -e "${YELLOW}1. Add this test identifier to your suspected source file:${NC}"
echo "   <!-- $TEST_IDENTIFIER -->"
echo -e "${YELLOW}2. Deploy your changes${NC}"
echo -e "${YELLOW}3. Run the verification:${NC}"
echo "   curl -s https://www.$DOMAIN/ | grep '$TEST_IDENTIFIER'"
echo -e "${YELLOW}4. If found: ✅ Repository confirmed${NC}"
echo -e "${YELLOW}5. If not found: ❌ Wrong repository${NC}"

echo -e "\n📊 Current Status"
echo "Domain: $DOMAIN"
echo -e "Repository Status: ${RED}UNKNOWN${NC}"
echo -e "Phone Number Status: ${RED}INCORRECT (626) 603-0954${NC}"
echo -e "Required Fix: ${YELLOW}Find correct repository first${NC}"

echo -e "\n⚠️  WARNING"
echo -e "${RED}DO NOT make changes until repository is verified!${NC}"
echo -e "${RED}Changes to wrong repository will not appear on live site${NC}"

echo -e "\n📚 Documentation"
echo "Update mapping in: DEPLOYMENT_MAPPING.md"
echo "After verification, update the domain-to-repository table"

echo -e "\n🔄 Next Steps"
echo "1. Identify the correct repository using test identifier"
echo "2. Update DEPLOYMENT_MAPPING.md with verified information"
echo "3. Make phone number changes to correct repository"
echo "4. Verify changes appear on live site"

echo -e "\n✅ Verification Complete"