# GramVaani Backend - Quick Start Guide

Get the backend up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (need 18+)
node --version

# Check AWS CLI
aws --version

# Check AWS credentials
aws sts get-caller-identity
```

## Step 1: Install Dependencies (2 minutes)

```bash
cd backend

# Install for all Lambda functions
cd lambda/process-voice && npm install && cd ../..
cd lambda/get-complaints && npm install && cd ../..
cd lambda/get-stats && npm install && cd ../..

# Install for scripts
cd scripts && npm install && cd ..
```

## Step 2: Create DynamoDB Table (1 minute)

```bash
# Create table in AWS
aws dynamodb create-table \
  --cli-input-json file://schemas/dynamodb-schema.json \
  --region us-east-1

# Wait for table to be active
aws dynamodb wait table-exists \
  --table-name gramvaani-complaints \
  --region us-east-1
```

## Step 3: Populate Test Data (30 seconds)

```bash
cd scripts
export TABLE_NAME=gramvaani-complaints
export AWS_REGION=us-east-1
node populate-test-data.js
cd ..
```

## Step 4: Deploy Lambda Functions (2 minutes)

### Option A: Using AWS Console

1. Run the packaging script:
```bash
chmod +x deploy.sh
./deploy.sh
```

2. Go to AWS Lambda Console
3. Create 3 Lambda functions:
   - `gramvaani-process-voice`
   - `gramvaani-get-complaints`
   - `gramvaani-get-stats`

4. For each function:
   - Upload ZIP from `dist/` folder
   - Set runtime: Node.js 18.x
   - Set environment variable: `TABLE_NAME=gramvaani-complaints`
   - Add DynamoDB permissions to execution role

### Option B: Using AWS CLI

```bash
# Package functions
./deploy.sh

# Create IAM role (one-time)
aws iam create-role \
  --role-name gramvaani-lambda-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "lambda.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

# Attach policies
aws iam attach-role-policy \
  --role-name gramvaani-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy \
  --role-name gramvaani-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

# Get role ARN
ROLE_ARN=$(aws iam get-role --role-name gramvaani-lambda-role --query 'Role.Arn' --output text)

# Create Lambda functions
aws lambda create-function \
  --function-name gramvaani-process-voice \
  --runtime nodejs18.x \
  --role $ROLE_ARN \
  --handler index.handler \
  --zip-file fileb://dist/process-voice.zip \
  --environment Variables={TABLE_NAME=gramvaani-complaints}

aws lambda create-function \
  --function-name gramvaani-get-complaints \
  --runtime nodejs18.x \
  --role $ROLE_ARN \
  --handler index.handler \
  --zip-file fileb://dist/get-complaints.zip \
  --environment Variables={TABLE_NAME=gramvaani-complaints}

aws lambda create-function \
  --function-name gramvaani-get-stats \
  --runtime nodejs18.x \
  --role $ROLE_ARN \
  --handler index.handler \
  --zip-file fileb://dist/get-stats.zip \
  --environment Variables={TABLE_NAME=gramvaani-complaints}
```

## Step 5: Setup API Gateway (2 minutes)

### Using AWS Console

1. Go to API Gateway Console
2. Create new REST API: "GramVaani API"
3. Create resources and methods:

```
/complaints
  - POST → gramvaani-process-voice
  - GET → gramvaani-get-complaints

/stats
  - GET → gramvaani-get-stats
```

4. Enable CORS for all methods
5. Deploy API to stage "prod"
6. Note the Invoke URL

### Enable CORS

For each method, add these to Integration Response:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Step 6: Test the API (1 minute)

```bash
# Set your API URL
export API_BASE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod

# Test submit complaint
curl -X POST $API_BASE_URL/complaints \
  -H "Content-Type: application/json" \
  -d '{"transcript":"Paani ki tanki kharab hai","village":"Rampur"}'

# Test get complaints
curl $API_BASE_URL/complaints

# Test get stats
curl $API_BASE_URL/stats

# Or run the test script
cd scripts
chmod +x test-api.sh
./test-api.sh
```

## Step 7: Connect Frontend

Update frontend to use your API URL:

```javascript
// In frontend/src/App.js or config file
const API_BASE_URL = 'https://your-api-id.execute-api.us-east-1.amazonaws.com/prod';
```

## Troubleshooting

### Lambda function timeout
```bash
aws lambda update-function-configuration \
  --function-name gramvaani-process-voice \
  --timeout 30
```

### DynamoDB permissions error
Check Lambda execution role has DynamoDB permissions:
```bash
aws iam attach-role-policy \
  --role-name gramvaani-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
```

### CORS errors
Ensure API Gateway has CORS enabled and Lambda functions return CORS headers.

### Test data not showing
Verify table name matches:
```bash
aws dynamodb scan --table-name gramvaani-complaints --limit 5
```

## Local Development (Optional)

For local testing without AWS:

1. Install DynamoDB Local:
```bash
docker run -p 8000:8000 amazon/dynamodb-local
```

2. Set endpoint:
```bash
export DYNAMODB_ENDPOINT=http://localhost:8000
```

3. Create local table:
```bash
aws dynamodb create-table \
  --cli-input-json file://schemas/dynamodb-schema.json \
  --endpoint-url http://localhost:8000
```

4. Test Lambda functions locally using AWS SAM or serverless-offline

## Next Steps

- Import Postman collection from `docs/POSTMAN_COLLECTION.json`
- Read full API docs in `docs/api-documentation.md`
- Check architecture diagram in `docs/architecture-diagram.md`
- Review backend README for detailed information

## Quick Commands Reference

```bash
# Populate test data
cd scripts && node populate-test-data.js

# Package Lambda functions
./deploy.sh

# Test API
cd scripts && ./test-api.sh

# View DynamoDB data
aws dynamodb scan --table-name gramvaani-complaints

# Update Lambda function
cd lambda/process-voice
zip -r ../../dist/process-voice.zip .
aws lambda update-function-code \
  --function-name gramvaani-process-voice \
  --zip-file fileb://../../dist/process-voice.zip
```

## Support

For issues, check:
1. CloudWatch Logs for Lambda errors
2. API Gateway execution logs
3. DynamoDB table status
4. IAM role permissions

Happy coding! 🚀
