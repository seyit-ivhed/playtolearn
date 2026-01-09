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

# Step 5: Reset and Start Local Supabase
echo -e "${YELLOW}Step 5: Resetting and starting local Supabase instance...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Docker is not running. Please start Docker Desktop and run this script again.${NC}"
    # Cleanup: Switch back to main and delete the created branch
    git checkout main
    git branch -d "$BRANCH_NAME"
    exit 1
fi

# Stop Supabase to ensure fresh config
echo -e "${YELLOW}Stopping existing Supabase services...${NC}"
npx supabase stop --no-backup

# Start Supabase
echo -e "${YELLOW}Starting Supabase services...${NC}"
npx supabase start
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to start local Supabase instance.${NC}"
    exit 1
fi

# Reset Database
echo -e "${YELLOW}Resetting database and applying migrations...${NC}"
npx supabase db reset --yes
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to reset Supabase database.${NC}"
    exit 1
fi

echo -e "${GREEN}Local Supabase instance started and reset successfully.${NC}\n"

# Step 6: Configure .env.local
echo -e "${YELLOW}Step 6: Configuring .env.local...${NC}"

# Extract credentials from supabase status
# We use json output for reliable parsing if available, but text grep is often simpler for simple scripts
# npx supabase status -o json... let's stick to standard status and grep for simplicity and reliability across versions without jq

# Capture status output in JSON format
SUPABASE_STATUS=$(npx supabase status -o json)

# Extract credentials using node for reliable JSON parsing
# We use node -p to print the result of the evaluation
API_URL=$(node -p "try { JSON.parse(process.argv[1]).API_URL } catch(e) { '' }" "$SUPABASE_STATUS")
ANON_KEY=$(node -p "try { JSON.parse(process.argv[1]).ANON_KEY } catch(e) { '' }" "$SUPABASE_STATUS")
SERVICE_KEY=$(node -p "try { JSON.parse(process.argv[1]).SERVICE_ROLE_KEY } catch(e) { '' }" "$SUPABASE_STATUS")

if [ -z "$API_URL" ] || [ -z "$ANON_KEY" ]; then
    echo -e "${RED}Failed to retrieve Supabase credentials.${NC}"
    echo -e "${YELLOW}Supabase Status Output:${NC}"
    echo "$SUPABASE_STATUS"
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
