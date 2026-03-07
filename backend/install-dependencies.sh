#!/bin/bash

# GramVaani Backend - Install All Dependencies
# This script installs npm dependencies for all Lambda functions and scripts

set -e

echo "🔧 Installing GramVaani Backend Dependencies"
echo "============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${YELLOW}Step 1: Installing process-voice dependencies${NC}"
cd lambda/process-voice
npm install
echo -e "${GREEN}✓ process-voice dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 2: Installing get-complaints dependencies${NC}"
cd ../get-complaints
npm install
echo -e "${GREEN}✓ get-complaints dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 3: Installing get-stats dependencies${NC}"
cd ../get-stats
npm install
echo -e "${GREEN}✓ get-stats dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 4: Installing scripts dependencies${NC}"
cd ../../scripts
npm install
echo -e "${GREEN}✓ scripts dependencies installed${NC}"
echo ""

cd ..

echo -e "${GREEN}✅ All dependencies installed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Configure AWS credentials: aws configure"
echo "2. Create DynamoDB table: aws dynamodb create-table --cli-input-json file://schemas/dynamodb-schema.json"
echo "3. Populate test data: cd scripts && node populate-test-data.js"
echo "4. Deploy Lambda functions: ./deploy.sh"
echo ""
echo "Or follow the EXECUTION_GUIDE.md for detailed instructions"
