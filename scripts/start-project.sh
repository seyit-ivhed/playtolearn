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

echo -e "${GREEN}Successfully published branch: $BRANCH_NAME${NC}"
echo -e "${GREEN}Project setup complete! You can now start working.${NC}"
