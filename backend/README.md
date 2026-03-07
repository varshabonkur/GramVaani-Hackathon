# GramVaani Backend

Voice-first feedback platform backend built with AWS Lambda and DynamoDB.

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Client    │────▶│   API Gateway    │────▶│   Lambda    │
│  (Frontend) │     │                  │     │  Functions  │
└─────────────┘     └──────────────────┘     └──────┬──────┘
                                                     │
                                                     ▼
                                            ┌─────────────────┐
                                            │    DynamoDB     │
                                            │ gramvaani-      │
                                            │ complaints      │
                                            └─────────────────┘
```

## Lambda Functions

### 1. process-voice
- **Purpose**: Process and store new complaints
- **Method**: POST
- **Input**: `{ transcript, village, audioUrl? }`
- **Features**:
  - Auto-classifies issue category (Water, Road, Electricity, etc.)
  - Detects urgency level (High, Medium, Low)
  - Performs sentiment analysis
  - Stores in DynamoDB

### 2. get-complaints
- **Purpose**: Retrieve complaints with filters
- **Method**: GET
- **Query Params**: `village`, `category`, `status`, `limit`
- **Output**: Array of complaints

### 3. get-stats
- **Purpose**: Get aggregated statistics
- **Method**: GET
- **Output**: Stats, breakdowns, and trend data

## Data Model

### Complaint Object
```json
{
  "id": "C1234567890",
  "transcript": "Paani ki tanki kharab hai",
  "category": "Water",
  "urgency": "High",
  "village": "Rampur",
  "timestamp": "2024-03-06T10:30:00Z",
  "status": "Open",
  "sentiment": -0.6,
  "audioUrl": "s3://bucket/audio.mp3",
  "source": "voice"
}
```

## Setup & Deployment

### Prerequisites
- Node.js 18+
- AWS CLI configured
- AWS account with Lambda and DynamoDB access

### Local Development

1. Install dependencies:
```bash
cd lambda/process-voice && npm install
cd ../get-complaints && npm install
cd ../get-stats && npm install
```

2. Set environment variables:
```bash
export TABLE_NAME=gramvaani-complaints
export AWS_REGION=us-east-1
```

3. Create DynamoDB table:
```bash
aws dynamodb create-table --cli-input-json file://schemas/dynamodb-schema.json
```

4. Populate test data:
```bash
cd scripts
npm install aws-sdk
node populate-test-data.js
```

### Deployment

Run the deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```

This will:
- Create DynamoDB table
- Install dependencies
- Package Lambda functions as ZIP files
- Output deployment instructions

### Manual Lambda Deployment

1. Create Lambda functions in AWS Console
2. Upload ZIP files from `dist/` folder
3. Set environment variable: `TABLE_NAME=gramvaani-complaints`
4. Configure API Gateway triggers
5. Enable CORS

## API Endpoints

### POST /complaints
Submit a new complaint

**Request:**
```json
{
  "transcript": "Paani ki tanki kharab hai",
  "village": "Rampur",
  "audioUrl": "https://s3.amazonaws.com/audio.mp3"
}
```

**Response:**
```json
{
  "success": true,
  "complaint": {
    "id": "C1234567890",
    "category": "Water",
    "urgency": "High",
    ...
  }
}
```

### GET /complaints
Get complaints with optional filters

**Query Parameters:**
- `village` - Filter by village name
- `category` - Filter by category (Water, Road, etc.)
- `status` - Filter by status (Open, In Progress, Resolved)
- `limit` - Max results (default: 100)

**Response:**
```json
{
  "complaints": [...],
  "count": 10
}
```

### GET /stats
Get aggregated statistics

**Response:**
```json
{
  "stats": {
    "total": 50,
    "open": 30,
    "urgent": 15,
    "villages": 5
  },
  "categoryBreakdown": {
    "Water": 20,
    "Road": 15,
    ...
  },
  "trendData": {
    "2024-03-06": 10,
    ...
  }
}
```

## Testing

### Test with curl
```bash
# Submit complaint
curl -X POST http://localhost:3000/complaints \
  -H "Content-Type: application/json" \
  -d '{"transcript":"Test complaint","village":"Rampur"}'

# Get complaints
curl http://localhost:3000/complaints?village=Rampur

# Get stats
curl http://localhost:3000/stats
```

### Run test script
```bash
chmod +x scripts/test-api.sh
export API_BASE_URL=https://your-api-gateway-url.com
./scripts/test-api.sh
```

## Classification Logic

### Category Detection
Keywords are matched to classify complaints:
- **Water**: paani, water, tanki, pipeline
- **Road**: sadak, road, gaddha
- **Electricity**: biji, electricity, light
- **Sanitation**: nala, sanitation, ganda
- **Health**: health, hospital, doctor

### Urgency Detection
High urgency if contains: emergency, urgent, kharab, toot, jam, nahi

### Sentiment Analysis
Negative keywords reduce sentiment score: kharab, toot, jam, nahi, ganda, problem

## File Structure

```
backend/
├── lambda/
│   ├── process-voice/
│   │   ├── index.js
│   │   └── package.json
│   ├── get-complaints/
│   │   ├── index.js
│   │   └── package.json
│   └── get-stats/
│       ├── index.js
│       └── package.json
├── schemas/
│   ├── dynamodb-schema.json
│   └── api-spec.yaml
├── scripts/
│   ├── populate-test-data.js
│   ├── test-data.js
│   └── test-api.sh
├── deploy.sh
└── README.md
```

## Environment Variables

- `TABLE_NAME` - DynamoDB table name (default: gramvaani-complaints)
- `AWS_REGION` - AWS region (default: us-east-1)
- `DYNAMODB_ENDPOINT` - For local DynamoDB (optional)

## Troubleshooting

### Lambda function timeout
Increase timeout to 30 seconds in Lambda configuration

### CORS errors
Enable CORS in API Gateway and add headers to Lambda responses

### DynamoDB access denied
Ensure Lambda execution role has DynamoDB permissions

## Future Enhancements

- Real voice-to-text with AWS Transcribe
- Advanced ML classification with SageMaker
- Real-time notifications with SNS
- Image upload support with S3
- Multi-language support
