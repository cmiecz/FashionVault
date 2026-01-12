#!/bin/bash

# Fashion Vault - Secure Deployment Script
# This script uses environment variables instead of hardcoded secrets

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "================================================"
echo "   Fashion Vault - Secure Deployment Script"
echo "================================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo ""
    echo "Please create a .env file with your secrets:"
    echo "1. Copy .env.example to .env"
    echo "2. Fill in your actual values"
    echo "3. Run this script again"
    echo ""
    echo "Example:"
    echo "  cp .env.example .env"
    echo "  nano .env  # Edit with your values"
    exit 1
fi

# Load environment variables from .env
echo -e "${YELLOW}Loading environment variables...${NC}"
source .env

# Validate required variables
if [ -z "$RESEND_API_KEY" ]; then
    echo -e "${RED}Error: RESEND_API_KEY not set in .env${NC}"
    exit 1
fi

if [ -z "$NOTIFICATION_EMAIL" ]; then
    echo -e "${RED}Error: NOTIFICATION_EMAIL not set in .env${NC}"
    exit 1
fi

if [ -z "$SUPABASE_PROJECT_REF" ]; then
    echo -e "${RED}Error: SUPABASE_PROJECT_REF not set in .env${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment variables loaded${NC}"
echo ""

# Set secrets in Supabase
echo -e "${YELLOW}Step 1: Setting Resend API key in Supabase...${NC}"
supabase secrets set RESEND_API_KEY="$RESEND_API_KEY"
echo -e "${GREEN}✓ API key set${NC}"
echo ""

echo -e "${YELLOW}Step 2: Setting notification email in Supabase...${NC}"
supabase secrets set NOTIFICATION_EMAIL="$NOTIFICATION_EMAIL"
echo -e "${GREEN}✓ Email set${NC}"
echo ""

echo -e "${YELLOW}Step 3: Linking Supabase project...${NC}"
supabase link --project-ref "$SUPABASE_PROJECT_REF"
echo -e "${GREEN}✓ Project linked${NC}"
echo ""

echo -e "${YELLOW}Step 4: Deploying Edge Function...${NC}"
supabase functions deploy send-signup-notification --project-ref "$SUPABASE_PROJECT_REF"
echo -e "${GREEN}✓ Function deployed${NC}"
echo ""

echo "================================================"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "================================================"
echo ""
echo "Next step: Configure the database webhook in Supabase Dashboard"
echo "See QUICK_EMAIL_SETUP.md for webhook configuration details."
echo ""
