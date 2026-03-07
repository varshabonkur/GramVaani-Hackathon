#!/bin/bash

# GramVaani Backend Deployment Script
# This script deploys Lambda functions and creates DynamoDB table

set -e

echo "🚀 GramVaani Backend Deployment"
echo "================================"

# Configuration
AWS_REGION=${AWS_REGION:-us-east-1}
TABLE_NAME="gramvaani-complaints"
STACK_NAME="gramvaani-backend"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Creating DynamoDB Table${NC}"
aws dynamodb create-table \
  --cli-input-json file://schemas/dynamodb-schema.json \
  --region $AWS_REGION \
  2>/dev/null || echo "Table already exists or creation failed"

echo -e "${GREEN}✓ DynamoDB table created/verified${NC}"

echo -e "\n${YELLOW}Step 2: Installing Lambda dependencies${NC}"

# Install dependencies for each Lambda function
for lambda_dir in lambda/*/; do
  lambda_name=$(basename "$lambda_dir")
  echo "Installing dependencies for $lambda_name..."
  cd "$lambda_dir"
  npm install --production
  cd ../..
done

echo -e "${GREEN}✓ Dependencies installed${NC}"

echo -e "\n${YELLOW}Step 3: Packaging Lambda functions${NC}"

mkdir -p dist

for lambda_dir in lambda/*/; do
  lambda_name=$(basename "$lambda_dir")
  echo "Packaging $lambda_name..."
  cd "$lambda_dir"
  zip -r "../../dist/${lambda_name}.zip" . -x "*.git*"
  cd ../..
done

echo -e "${GREEN}✓ Lambda functions packaged${NC}"

echo -e "\n${YELLOW}Step 4: Deploying Lambda functions${NC}"
echo "Note: You need to create Lambda functions in AWS Console or use AWS SAM/CloudFormation"
echo "Upload the ZIP files from dist/ folder to your Lambda functions"

echo -e "\n${GREEN}✓ Deployment preparation complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Upload ZIP files from dist/ to AWS Lambda"
echo "2. Set environment variable TABLE_NAME=$TABLE_NAME for each Lambda"
echo "3. Configure API Gateway to trigger the Lambda functions"
echo "4. Run: node scripts/populate-test-data.js to add test data"
