# GramVaani - Windows Execution Guide

## For Windows Users (PowerShell/CMD)

### Step 1: Install Dependencies

Open PowerShell or Command Prompt in the project folder:

```powershell
cd GramVaani-Hackathon\backend

# Install dependencies for each Lambda function
cd lambda\process-voice
npm install
cd ..\get-complaints
npm install
cd ..\get-stats
npm install
cd ..\..

# Install dependencies for scripts
cd scripts
npm install
cd ..
```

### Step 2: Quick Test (Without AWS)

You can test the Lambda functions locally without deploying to AWS:

#### Test the classification logic:

Create a test file `test-local.js` in the backend folder:

```javascript
// Copy the classification functions from process-voice
const classifyIssue = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('paani') || lower.includes('water') || lower.includes('tanki') || lower.includes('pipeline')) return 'Water';
  if (lower.includes('sadak') || lower.includes('road') || lower.includes('gaddha')) return 'Road';
  if (lower.includes('biji') || lower.includes('electricity') || lower.includes('light')) return 'Electricity';
  if (lower.includes('nala') || lower.includes('sanitation') || lower.includes('ganda')) return 'Sanitation';
  if (lower.includes('health') || lower.includes('hospital') || lower.includes('doctor')) return 'Health';
  return 'Other';
};

const detectUrgency = (text) => {
  const lower = text.toLowerCase();
  const urgentKeywords = ['emergency', 'urgent', 'kharab', 'toot', 'jam', 'nahi'];
  const hasUrgent = urgentKeywords.some(keyword => lower.includes(keyword));
  return hasUrgent ? 'High' : 'Medium';
};

// Test
const testCases = [
  'Paani ki tanki kharab hai',
  'Sadak mein gaddha hai',
  'Biji nahi aa rahi hai'
];

testCases.forEach(text => {
  console.log(`\nText: ${text}`);
  console.log(`Category: ${classifyIssue(text)}`);
  console.log(`Urgency: ${detectUrgency(text)}`);
});
```

Run it:
```powershell
node test-local.js
```

### Step 3: Deploy to AWS (Recommended)

#### Prerequisites:
```powershell
# Check Node.js
node --version

# Check AWS CLI
aws --version

# If AWS CLI not installed, download from:
# https://aws.amazon.com/cli/

# Configure AWS credentials
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter region: us-east-1
# Enter output format: json
```

#### Create DynamoDB Table:

```powershell
cd GramVaani-Hackathon\backend

aws dynamodb create-table --cli-input-json file://schemas/dynamodb-schema.json --region us-east-1
```

Wait for table to be ready:
```powershell
aws dynamodb wait table-exists --table-name gramvaani-complaints --region us-east-1
```

#### Populate Test Data:

```powershell
cd scripts
$env:TABLE_NAME="gramvaani-complaints"
$env:AWS_REGION="us-east-1"
node populate-test-data.js
cd ..
```

#### Package Lambda Functions (Manual on Windows):

```powershell
# Create dist folder
New-Item -ItemType Directory -Force -Path dist

# Package process-voice
cd lambda\process-voice
Compress-Archive -Path * -DestinationPath ..\..\dist\process-voice.zip -Force
cd ..\..

# Package get-complaints
cd lambda\get-complaints
Compress-Archive -Path * -DestinationPath ..\..\dist\get-complaints.zip -Force
cd ..\..

# Package get-stats
cd lambda\get-stats
Compress-Archive -Path * -DestinationPath ..\..\dist\get-stats.zip -Force
cd ..\..
```

#### Create IAM Role:

```powershell
# Create role
aws iam create-role --role-name gramvaani-lambda-role --assume-role-policy-document '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"lambda.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}'

# Attach policies
aws iam attach-role-policy --role-name gramvaani-lambda-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy --role-name gramvaani-lambda-role --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

# Wait for role to propagate
Start-Sleep -Seconds 10

# Get role ARN
$ROLE_ARN = aws iam get-role --role-name gramvaani-lambda-role --query 'Role.Arn' --output text
echo $ROLE_ARN
```

#### Create Lambda Functions:

```powershell
# Create process-voice
aws lambda create-function --function-name gramvaani-process-voice --runtime nodejs18.x --role $ROLE_ARN --handler index.handler --zip-file fileb://dist/process-voice.zip --timeout 30 --environment Variables={TABLE_NAME=gramvaani-complaints} --region us-east-1

# Create get-complaints
aws lambda create-function --function-name gramvaani-get-complaints --runtime nodejs18.x --role $ROLE_ARN --handler index.handler --zip-file fileb://dist/get-complaints.zip --timeout 30 --environment Variables={TABLE_NAME=gramvaani-complaints} --region us-east-1

# Create get-stats
aws lambda create-function --function-name gramvaani-get-stats --runtime nodejs18.x --role $ROLE_ARN --handler index.handler --zip-file fileb://dist/get-stats.zip --timeout 30 --environment Variables={TABLE_NAME=gramvaani-complaints} --region us-east-1
```

#### Test Lambda Functions:

```powershell
# Test process-voice
aws lambda invoke --function-name gramvaani-process-voice --payload '{\"body\":\"{\\\"transcript\\\":\\\"Paani ki tanki kharab hai\\\",\\\"village\\\":\\\"Rampur\\\"}\"}' response.json

# View response
Get-Content response.json

# Test get-complaints
aws lambda invoke --function-name gramvaani-get-complaints --payload '{}' response.json
Get-Content response.json

# Test get-stats
aws lambda invoke --function-name gramvaani-get-stats --payload '{}' response.json
Get-Content response.json
```

### Step 4: Setup API Gateway (AWS Console)

Since API Gateway setup is easier via console on Windows:

1. Open AWS Console → API Gateway
2. Click "Create API" → "REST API" → "Build"
3. API name: "GramVaani API"
4. Create resources:
   - Click "Actions" → "Create Resource"
   - Resource Name: "complaints"
   - Click "Create Resource"
5. Add POST method to /complaints:
   - Select /complaints
   - Click "Actions" → "Create Method" → "POST"
   - Integration type: Lambda Function
   - Lambda Function: gramvaani-process-voice
   - Save and confirm
6. Add GET method to /complaints:
   - Click "Actions" → "Create Method" → "GET"
   - Lambda Function: gramvaani-get-complaints
   - Save
7. Create /stats resource and add GET method:
   - Lambda Function: gramvaani-get-stats
8. Enable CORS:
   - Select each resource
   - Click "Actions" → "Enable CORS"
   - Click "Enable CORS and replace existing CORS headers"
9. Deploy API:
   - Click "Actions" → "Deploy API"
   - Stage: [New Stage] "prod"
   - Deploy
10. Copy the "Invoke URL"

### Step 5: Test API

```powershell
# Set your API URL (replace with your actual URL)
$API_BASE_URL = "https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod"

# Test get stats
curl $API_BASE_URL/stats

# Test get complaints
curl $API_BASE_URL/complaints

# Test submit complaint (PowerShell)
$body = @{
    transcript = "Paani ki tanki kharab hai"
    village = "Rampur"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_BASE_URL/complaints" -Method Post -Body $body -ContentType "application/json"
```

### Step 6: Run Frontend

```powershell
cd ..\frontend

# Install dependencies
npm install

# Start development server
npm start
```

Browser will open at `http://localhost:3000`

## Simplified Windows Installation Script

Create `install-all.ps1` in the backend folder:

```powershell
# Install all dependencies
Write-Host "Installing Lambda dependencies..." -ForegroundColor Yellow

Set-Location lambda\process-voice
npm install
Set-Location ..\get-complaints
npm install
Set-Location ..\get-stats
npm install
Set-Location ..\..\scripts
npm install
Set-Location ..

Write-Host "All dependencies installed!" -ForegroundColor Green
```

Run it:
```powershell
powershell -ExecutionPolicy Bypass -File install-all.ps1
```

## Troubleshooting Windows Issues

### PowerShell Execution Policy Error
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### AWS CLI Not Found
Download and install from: https://aws.amazon.com/cli/

### Node.js Not Found
Download and install from: https://nodejs.org/

### Compress-Archive Error
Make sure you're in the correct directory and the files exist.

## Quick Commands for Windows

```powershell
# Navigate to backend
cd GramVaani-Hackathon\backend

# Install all dependencies (one by one)
cd lambda\process-voice; npm install; cd ..\get-complaints; npm install; cd ..\get-stats; npm install; cd ..\..\scripts; npm install; cd ..

# Check DynamoDB table
aws dynamodb describe-table --table-name gramvaani-complaints

# List Lambda functions
aws lambda list-functions --query 'Functions[?starts_with(FunctionName, `gramvaani`)].FunctionName'

# View DynamoDB data
aws dynamodb scan --table-name gramvaani-complaints --limit 5
```

## What You Need for Demo

**Minimum (No AWS):**
1. Install dependencies
2. Run local test
3. Show code and explain logic

**Full Demo (With AWS):**
1. Install dependencies
2. Deploy to AWS
3. Test Lambda functions
4. Setup API Gateway
5. Run frontend
6. Show complete system

---

**Recommended**: Start with local testing, then deploy to AWS if you have credentials configured.
