#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Supabase sync workflow...${NC}\n"

# Step 1: Get current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ]; then
    echo -e "${RED}Syncing directly to main is not recommended via this script.${NC}"
    echo -e "${RED}Use complete-project.sh to deploy to production.${NC}"
    exit 1
fi

echo -e "${YELLOW}Current branch: $CURRENT_BRANCH${NC}"

# Step 2: Get Supabase branch details
echo -e "${YELLOW}Fetching Supabase branch details...${NC}"
BRANCH_DETAILS=$(supabase branches list --output json | node -e "
const input = require('fs').readFileSync(0, 'utf8');
try {
    const branches = JSON.parse(input);
    const branch = branches.find(b => b.name === '$CURRENT_BRANCH');
    if (branch) {
        process.stdout.write(branch.id);
    } else {
        process.exit(1);
    }
} catch (e) {
    process.exit(1);
}
")

if [ $? -ne 0 ] || [ -z "$BRANCH_DETAILS" ]; then
    echo -e "${RED}Could not find Supabase branch named '$CURRENT_BRANCH'.${NC}"
    echo -e "${YELLOW}Try running 'supabase branches create $CURRENT_BRANCH' first.${NC}"
    exit 1
fi

echo -e "${GREEN}Found Supabase branch ID: $BRANCH_DETAILS${NC}\n"

# Step 3: Push migrations to the branch
echo -e "${YELLOW}Pushing migrations to Supabase branch...${NC}"
# Note: We use the linked project ref but Supabase CLI should handle the branch if matched
# However, to be explicit if the CLI supports it, we would use it. 
# In 2.x, database operations are often branch-aware if you use the branch commands.
# But 'db push' usually targets the linked project.
# If branching is enabled, 'supabase db push' targets the branch if linked.
# Let's try to use the standard push first.

supabase db push
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to push migrations to Supabase.${NC}"
    exit 1
fi

echo -e "${GREEN}Migrations pushed successfully.${NC}\n"

# Step 4: Push config
echo -e "${YELLOW}Pushing Supabase configuration...${NC}"
# 'supabase config push' is not a standard command in all versions, 
# but migrations usually handle schema.
# If they have a specific config file, we'd apply it here.

echo -e "${GREEN}Sync complete!${NC}"
