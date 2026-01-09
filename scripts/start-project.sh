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

# Step 4: Push the new branch to origin
echo -e "${YELLOW}Step 4: Publishing branch to origin...${NC}"
git push -u origin "$BRANCH_NAME"
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to push branch to origin.${NC}"
    exit 1
fi

echo -e "${GREEN}Successfully published branch: $BRANCH_NAME${NC}\n"

# Step 5: Start Local Supabase
echo -e "${YELLOW}Step 5: Starting local Supabase instance...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Docker is not running. Please start Docker Desktop and run this script again.${NC}"
    # Cleanup: Switch back to main and delete the created branch
    git checkout main
    git branch -d "$BRANCH_NAME"
    exit 1
fi

# Start Supabase
npx supabase start
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to start local Supabase instance.${NC}"
    exit 1
fi

echo -e "${GREEN}Local Supabase instance started successfully.${NC}\n"

# Step 6: Configure .env.local
echo -e "${YELLOW}Step 6: Configuring .env.local...${NC}"

# Extract credentials from supabase status
# We use json output for reliable parsing if available, but text grep is often simpler for simple scripts
# npx supabase status -o json... let's stick to standard status and grep for simplicity and reliability across versions without jq

# Capture status output
SUPABASE_STATUS=$(npx supabase status)

# Extract API URL and Anon Key
# Typical output:
# API URL: http://localhost:54321
# anon key: eyJ...
API_URL=$(echo "$SUPABASE_STATUS" | grep "API URL" | awk '{print $3}')
ANON_KEY=$(echo "$SUPABASE_STATUS" | grep "anon key" | awk '{print $3}')
SERVICE_KEY=$(echo "$SUPABASE_STATUS" | grep "service_role key" | awk '{print $3}')

if [ -z "$API_URL" ] || [ -z "$ANON_KEY" ]; then
    echo -e "${RED}Failed to retrieve Supabase credentials.${NC}"
    exit 1
fi

# Write to .env.local
cat > .env.local <<EOL
VITE_SUPABASE_URL=$API_URL
VITE_SUPABASE_ANON_KEY=$ANON_KEY
VITE_SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY
EOL

echo -e "${GREEN}Created .env.local with local Supabase credentials.${NC}\n"

echo -e "${GREEN}Project setup complete! You can now start working.${NC}"
