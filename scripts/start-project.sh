#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting new project workflow...${NC}\n"

# Step 1: Pull latest changes from origin
echo -e "${YELLOW}Step 1: Pulling latest changes from origin...${NC}"
git fetch origin
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to fetch from origin. Please check your connection.${NC}"
    exit 1
fi

git pull origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to pull from origin. Please resolve any conflicts manually.${NC}"
    exit 1
fi

echo -e "${GREEN}Successfully pulled latest changes.${NC}\n"

# Step 2: Run unit tests
echo -e "${YELLOW}Step 2: Running unit tests...${NC}"
npm run test -- --run
if [ $? -ne 0 ]; then
    echo -e "${RED}Unit tests failed. Please fix the tests before starting a new branch.${NC}"
    exit 1
fi

echo -e "${GREEN}Unit tests passed.${NC}\n"

# Step 3: Ask for branch name
echo -e "${YELLOW}Step 3: Creating new branch...${NC}"
read -p "Enter the name for the new branch: " BRANCH_NAME

if [ -z "$BRANCH_NAME" ]; then
    echo -e "${RED}Branch name cannot be empty.${NC}"
    exit 1
fi

# Create and checkout new branch
git checkout -b "$BRANCH_NAME"
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create branch. Branch might already exist.${NC}"
    exit 1
fi

echo -e "${GREEN}Created and switched to branch: $BRANCH_NAME${NC}\n"

# Step 4: Create Supabase branch
echo -e "${YELLOW}Step 4: Creating Supabase preview branch...${NC}"
supabase branches create "$BRANCH_NAME"
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create Supabase branch. It might already exist or branching is not enabled.${NC}"
    # We don't exit here because the user might want to continue anyway if the branch exists
else
    echo -e "${GREEN}Successfully created Supabase branch: $BRANCH_NAME${NC}\n"
fi

# Step 5: Sync .env.local with Supabase branch
echo -e "${YELLOW}Step 5: Updating .env.local with branch URL...${NC}"
BRANCH_DATA=$(supabase branches get "$BRANCH_NAME" --output json)
if [ $? -eq 0 ]; then
    # Extract API URL using Node.js
    BRANCH_URL=$(echo "$BRANCH_DATA" | node -e "
    const input = require('fs').readFileSync(0, 'utf8');
    try {
        const data = JSON.parse(input);
        // Supabase CLI 2.x returns preview_branch_id or similar. 
        // We'll target the API URL if available or construct it.
        // Usually it's in data.api_url or similar.
        process.stdout.write(data.api_url || '');
    } catch (e) {
        process.exit(1);
    }
    ")
    
    if [ -n "$BRANCH_URL" ]; then
        echo "VITE_SUPABASE_URL=$BRANCH_URL" > .env.local
        echo -e "${GREEN}Updated .env.local. Your app will now connect to the branch!${NC}\n"
    else
        echo -e "${YELLOW}Warning: Could not extract API URL for the branch. You may need to update .env.local manually.${NC}"
    fi
else
    echo -e "${YELLOW}Warning: Could not fetch branch details. You may need to update .env.local manually.${NC}"
fi

# Step 6: Push the new branch to origin
echo -e "${YELLOW}Step 6: Publishing branch to origin...${NC}"
git push -u origin "$BRANCH_NAME"
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to push branch to origin.${NC}"
    exit 1
fi

echo -e "${GREEN}Successfully published branch: $BRANCH_NAME${NC}"
echo -e "${GREEN}Project setup complete! You can now start working.${NC}"
