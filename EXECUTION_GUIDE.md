# GramVaani - How to Execute

## Quick Execution Steps

### Step 1: Install Dependencies (Required)

Open your terminal in the project root and run:

```bash
cd GramVaani-Hackathon/backend

# Install dependencies for each Lambda function
cd lambda/process-voice
npm install
cd ../get-complaints
npm install
cd ../get-stats
npm install
cd ../..

# Install dependencies for scripts
cd scripts
npm install
cd ..
```

### Step 2: Choose Your Execution Method

You have 3 options:

## Option A: Local Testing (Easiest - No AWS Required)

If you want to test locally without AWS:

1. **Install DynamoDB Local** (using Docker):
```bash
docker run -p 8000:8000 amazon/dynamodb-local
```

2. **Create local table**:
```bash
aws dynamodb create-table \
  --cli-input-json file://schemas/dynamodb-schema.json \
  --endpoint-url http://localhost:8000 \
  --region us-east-1
```

3. **Set environment variables**:
```bash
export DYNAMODB_ENDPOINT=http://localhost:8000
export TABLE_NAME=gramvaani-complaints
export AWS_REGION=us-east-1
```

4. **Populate test data**:
```bash
cd scripts
node populate-test-data.js
```

5. **Test Lambda functions locally** (you'll need to create a test harness or use AWS SAM)

## Option B: Deploy to AWS (Recommended for Demo)

### Prerequisites Check:
```bash
# Check Node.js
node --version  # Should be 18+

# Check AWS CLI
aws --version

# Check AWS credentials
aws sts get-caller-identity
```

### Deploy Steps:

1. **Create DynamoDB Table**:
```bash
cd GramVaani-Hackathon/backend

aws dynamodb create-table \
  --cli-input-json file://schemas/dynamodb-schema.json \
  --region us-east-1
```

2. **Wait for table to be ready**:
```bash
aws dynamodb wait table-exists \
  --table-name gramvaani-complaints \
  --region us-east-1
```

3. **Populate test data**:
```bash
cd scripts
export TABLE_NAME=gramvaani-complaints
export AWS_REGION=us-east-1
node populate-test-data.js
cd ..
```

4. **Package Lambda functions**:
```bash
chmod +x deploy.sh
./deploy.sh
```

5. **Create IAM Role for Lambda**:
```bash
# Create role
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

# Wait a moment for role to propagate
sleep 10
```

6. **Get Role ARN**:
```bash
ROLE_ARN=$(aws iam get-role --role-name gramvaani-lambda-role --query 'Role.Arn' --output text)
echo $ROLE_ARN
```

7. **Create Lambda Functions**:
```bash
# Create process-voice function
aws lambda create-function \
  --function-name gramvaani-process-voice \
  --runtime nodejs18.x \
  --role $ROLE_ARN \
  --handler index.handler \
  --zip-file fileb://dist/process-voice.zip \
  --timeout 30 \
  --environment Variables={TABLE_NAME=gramvaani-complaints} \
  --region us-east-1

# Create get-complaints function
aws lambda create-function \
  --function-name gramvaani-get-complaints \
  --runtime nodejs18.x \
  --role $ROLE_ARN \
  --handler index.handler \
  --zip-file fileb://dist/get-complaints.zip \
  --timeout 30 \
  --environment Variables={TABLE_NAME=gramvaani-complaints} \
  --region us-east-1

# Create get-stats function
aws lambda create-function \
  --function-name gramvaani-get-stats \
  --runtime nodejs18.x \
  --role $ROLE_ARN \
  --handler index.handler \
  --zip-file fileb://dist/get-stats.zip \
  --timeout 30 \
  --environment Variables={TABLE_NAME=gramvaani-complaints} \
  --region us-east-1
```

8. **Test Lambda Functions Directly**:
```bash
# Test process-voice
aws lambda invoke \
  --function-name gramvaani-process-voice \
  --payload '{"body":"{\"transcript\":\"Paani ki tanki kharab hai\",\"village\":\"Rampur\"}"}' \
  response.json

cat response.json

# Test get-complaints
aws lambda invoke \
  --function-name gramvaani-get-complaints \
  --payload '{}' \
  response.json

cat response.json

# Test get-stats
aws lambda invoke \
  --function-name gramvaani-get-stats \
  --payload '{}' \
  response.json

cat response.json
```

9. **Setup API Gateway** (via AWS Console):
   - Go to AWS Console → API Gateway
   - Create new REST API: "GramVaani API"
   - Create resources: `/complaints` and `/stats`
   - Add methods and link to Lambda functions
   - Enable CORS
   - Deploy to stage "prod"
   - Copy the Invoke URL

10. **Test API**:
```bash
# Replace with your API URL
export API_BASE_URL=https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod

# Test
curl $API_BASE_URL/stats
curl $API_BASE_URL/complaints
```

## Option C: Use AWS Console (Manual)

1. **DynamoDB**:
   - Go to AWS Console → DynamoDB
   - Create table: `gramvaani-complaints`
   - Primary key: `id` (String)
   - Add GSIs from schema file

2. **Lambda**:
   - Go to AWS Console → Lambda
   - Create 3 functions
   - Upload ZIP files from `dist/` folder
   - Set environment variable: `TABLE_NAME=gramvaani-complaints`

3. **API Gateway**:
   - Create REST API
   - Add resources and methods
   - Link to Lambda functions
   - Enable CORS
   - Deploy

## Step 3: Run Frontend

Once backend is deployed:

```bash
cd GramVaani-Hackathon/frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will open at `http://localhost:3000`

## Verification

Check if everything works:

```bash
# Check DynamoDB has data
aws dynamodb scan --table-name gramvaani-complaints --limit 5

# Check Lambda functions exist
aws lambda list-functions | grep gramvaani

# Test API (if deployed)
curl $API_BASE_URL/stats
```

## Troubleshooting

### "aws: command not found"
Install AWS CLI: https://aws.amazon.com/cli/

### "Credentials not found"
Configure AWS:
```bash
aws configure
```

### "Table already exists"
That's okay, skip table creation

### "Role not found" when creating Lambda
Wait 10-20 seconds after creating the role, then retry

### Lambda timeout
Increase timeout:
```bash
aws lambda update-function-configuration \
  --function-name gramvaani-process-voice \
  --timeout 30
```

## What to Execute for Demo

**Minimum for demo:**
1. Install dependencies
2. Deploy to AWS (Option B, steps 1-8)
3. Test Lambda functions directly (step 8)
4. Show data in DynamoDB

**Full demo:**
1. Complete Option B (all steps)
2. Run frontend
3. Show complete system working

## Quick Commands Reference

```bash
# Navigate to backend
cd GramVaani-Hackathon/backend

# Install all dependencies
for dir in lambda/*/; do (cd "$dir" && npm install); done
cd scripts && npm install && cd ..

# Deploy
./deploy.sh

# Populate data
cd scripts && node populate-test-data.js

# Test API
cd scripts && ./test-api.sh
```

## Need Help?

- Check `backend/QUICKSTART.md` for detailed steps
- Check `backend/DEPLOYMENT_CHECKLIST.md` for verification
- Check `backend/README.md` for architecture details
- Check `docs/api-documentation.md` for API details

---

**Recommended Path**: Start with Option B (Deploy to AWS) for the best demo experience!
