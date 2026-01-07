#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Supabase deployment...${NC}\n"

# 1. Apply database migrations
echo -e "${YELLOW}Step 1: Applying database migrations...${NC}"
supabase db push
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to push database migrations.${NC}"
    exit 1
fi
echo -e "${GREEN}Database migrations applied successfully.${NC}\n"

# 2. Apply configuration changes
echo -e "${YELLOW}Step 2: Applying configuration changes...${NC}"
supabase config push
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to push configuration changes.${NC}"
    exit 1
fi
echo -e "${GREEN}Configuration changes applied successfully.${NC}\n"

# 3. Redeploy edge functions
echo -e "${YELLOW}Step 3: Redeploying all edge functions...${NC}"
supabase functions deploy
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to deploy edge functions.${NC}"
    exit 1
fi
echo -e "${GREEN}All edge functions redeployed successfully.${NC}\n"

echo -e "${GREEN}Supabase deployment completed successfully!${NC}"
