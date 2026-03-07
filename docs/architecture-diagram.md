# GramVaani Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐              ┌──────────────────┐            │
│  │  Mobile/Web UI   │              │  Admin Dashboard │            │
│  │  (React)         │              │  (React)         │            │
│  │                  │              │                  │            │
│  │  - Voice Input   │              │  - Heatmap       │            │
│  │  - Text Input    │              │  - Statistics    │            │
│  │  - Confirmation  │              │  - Filters       │            │
│  └────────┬─────────┘              └────────┬─────────┘            │
│           │                                 │                       │
└───────────┼─────────────────────────────────┼───────────────────────┘
            │                                 │
            │                                 │
            ▼                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    AWS API Gateway                            │  │
│  │                                                                │  │
│  │  POST /complaints    GET /complaints    GET /stats           │  │
│  └──────────┬────────────────────┬────────────────┬──────────────┘  │
│             │                    │                │                 │
└─────────────┼────────────────────┼────────────────┼─────────────────┘
              │                    │                │
              ▼                    ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PROCESSING LAYER (Lambda)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│  │ process-     │    │ get-         │    │ get-stats    │         │
│  │ voice        │    │ complaints   │    │              │         │
│  │              │    │              │    │              │         │
│  │ - Classify   │    │ - Filter     │    │ - Aggregate  │         │
│  │ - Sentiment  │    │ - Sort       │    │ - Trends     │         │
│  │ - Urgency    │    │ - Paginate   │    │ - Breakdown  │         │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘         │
│         │                   │                   │                  │
└─────────┼───────────────────┼───────────────────┼──────────────────┘
          │                   │                   │
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    DynamoDB Table                             │  │
│  │                 gramvaani-complaints                          │  │
│  │                                                                │  │
│  │  Primary Key: id                                              │  │
│  │  GSI: timestamp-index, village-index                          │  │
│  │                                                                │  │
│  │  Attributes:                                                   │  │
│  │  - id, transcript, category, urgency                          │  │
│  │  - village, timestamp, status, sentiment                      │  │
│  │  - audioUrl, source                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Submit Complaint Flow
```
User Input (Voice/Text)
    │
    ▼
Frontend captures transcript + village
    │
    ▼
POST /complaints → API Gateway
    │
    ▼
process-voice Lambda
    │
    ├─→ Classify category (Water, Road, etc.)
    ├─→ Detect urgency (High, Medium, Low)
    ├─→ Analyze sentiment (-1 to 1)
    └─→ Generate unique ID
    │
    ▼
Store in DynamoDB
    │
    ▼
Return complaint object to frontend
    │
    ▼
Show confirmation to user
```

### 2. View Dashboard Flow
```
Admin opens dashboard
    │
    ▼
Frontend requests data
    │
    ├─→ GET /complaints → get-complaints Lambda
    │       │
    │       ▼
    │   Fetch from DynamoDB
    │       │
    │       ▼
    │   Apply filters (village, category, status)
    │       │
    │       ▼
    │   Return filtered complaints
    │
    └─→ GET /stats → get-stats Lambda
            │
            ▼
        Fetch all complaints
            │
            ▼
        Calculate aggregations
            │
            ▼
        Return statistics
    │
    ▼
Frontend renders:
    - Heatmap
    - Category charts
    - Statistics cards
    - Complaints table
```

## Component Responsibilities

### Frontend (React)
- User interface for complaint submission
- Admin dashboard with visualizations
- Filters and search functionality
- Real-time data display

### API Gateway
- Route requests to appropriate Lambda functions
- Handle CORS
- Request validation
- Rate limiting (future)

### Lambda Functions

#### process-voice
- Receive complaint data
- Perform NLP classification
- Calculate urgency and sentiment
- Store in database

#### get-complaints
- Query DynamoDB
- Apply filters
- Sort and paginate results
- Return complaint list

#### get-stats
- Aggregate complaint data
- Calculate statistics
- Generate trend data
- Return analytics

### DynamoDB
- Store complaint records
- Support fast queries
- Enable filtering by village/timestamp
- Scale automatically

## Technology Stack

- **Frontend**: React, Chart.js, Leaflet
- **Backend**: AWS Lambda (Node.js)
- **Database**: DynamoDB
- **API**: REST via API Gateway
- **Deployment**: AWS CloudFormation/SAM

## Security Considerations

- CORS enabled for frontend access
- Input validation in Lambda functions
- DynamoDB encryption at rest
- IAM roles for Lambda execution
- API Gateway throttling (future)

## Scalability

- Lambda auto-scales with demand
- DynamoDB on-demand scaling
- CloudFront CDN for frontend (future)
- Multi-region deployment (future)
