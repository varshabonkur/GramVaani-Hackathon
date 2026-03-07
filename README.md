# 📢 GramVaani - Voice of the Village

An AI-powered voice-first feedback platform that enables rural communities to report public service issues and helps local administrators visualize and respond through an interactive dashboard.

## 🎯 Project Overview

GramVaani addresses the challenge of collecting and managing feedback from rural communities where literacy rates may be low and internet connectivity is limited. The platform:

- Accepts voice and text complaints in Hindi/regional languages
- Automatically classifies issues (water, roads, electricity, sanitation, health)
- Detects urgency levels and sentiment
- Provides real-time visualization for administrators
- Identifies hotspots and trends

## ✨ Features

### User Side
- 🎤 Voice input support (Hindi/regional languages)
- ✍️ Text input option
- 🏷️ Automatic issue classification
- 📍 Location tracking (village/block/district)
- ✅ Instant confirmation

### Admin Dashboard
- 🗺️ Real-time complaint heatmap
- 📊 Trend analysis and statistics
- 🔍 Filters by village, category, status
- 🚨 Urgency-based prioritization
- ✔️ Status management (Open/In Progress/Resolved)

### Analytics
- 😊 Sentiment analysis
- 📈 Weekly summary reports
- 🔥 Hotspot identification
- 📉 Category and village breakdowns

## 🏗️ Architecture

```
Frontend (React) ←→ API Gateway ←→ Lambda Functions ←→ DynamoDB
```

See [Architecture Diagram](docs/architecture-diagram.md) for detailed flow.

## 📁 Project Structure

```
GramVaani-Hackathon/
├── frontend/                    # React dashboard (Person B)
│   ├── src/
│   │   ├── components/
│   │   └── utils/
│   └── package.json
│
├── backend/                     # AWS Lambda backend
│   ├── lambda/
│   │   ├── process-voice/      # Submit complaints
│   │   ├── get-complaints/     # Retrieve complaints
│   │   └── get-stats/          # Get statistics
│   ├── schemas/
│   │   ├── dynamodb-schema.json
│   │   └── api-spec.yaml
│   ├── scripts/
│   │   ├── populate-test-data.js
│   │   ├── test-data.js
│   │   └── test-api.sh
│   ├── deploy.sh
│   └── README.md
│
├── docs/
│   ├── architecture-diagram.md
│   ├── api-documentation.md
│   └── POSTMAN_COLLECTION.json
│
├── requirements.md
├── design.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- AWS CLI configured
- AWS account (for deployment)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies for each Lambda function:
```bash
cd lambda/process-voice && npm install
cd ../get-complaints && npm install
cd ../get-stats && npm install
cd ../..
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

5. Deploy Lambda functions:
```bash
chmod +x deploy.sh
./deploy.sh
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Open browser to `http://localhost:3000`

## 📡 API Endpoints

### POST /complaints
Submit a new complaint
```json
{
  "transcript": "Paani ki tanki kharab hai",
  "village": "Rampur",
  "audioUrl": "https://s3.amazonaws.com/audio.mp3"
}
```

### GET /complaints
Get complaints with filters
```
?village=Rampur&category=Water&status=Open&limit=100
```

### GET /stats
Get aggregated statistics and analytics

See [API Documentation](docs/api-documentation.md) for complete details.

## 🧪 Testing

### Test API with curl
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
cd backend/scripts
chmod +x test-api.sh
export API_BASE_URL=https://your-api-url.com
./test-api.sh
```

### Import Postman Collection
Import `docs/POSTMAN_COLLECTION.json` into Postman for easy API testing.

## 🤖 Classification Logic

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

## 📊 Data Model

### Complaint Object
```json
{
  "id": "C1709721000000",
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

## 🛠️ Technology Stack

### Frontend
- React 18
- Chart.js (visualizations)
- Leaflet (maps)
- CSS3

### Backend
- AWS Lambda (Node.js 18)
- AWS API Gateway
- AWS DynamoDB
- AWS S3 (audio storage)

### Development
- npm/Node.js
- AWS CLI
- Postman

## 📚 Documentation

- [Backend README](backend/README.md) - Detailed backend documentation
- [API Documentation](docs/api-documentation.md) - Complete API reference
- [Architecture Diagram](docs/architecture-diagram.md) - System architecture
- [Requirements](requirements.md) - Project requirements
- [Design Document](design.md) - Design decisions

## 🔒 Security & Privacy

- All data is anonymized (no personal identifiers)
- Using synthetic data for demo purposes
- CORS enabled for frontend access
- Input validation in all Lambda functions
- DynamoDB encryption at rest

## 🚧 Limitations

- Currently uses keyword-based classification (not ML)
- Synthetic data only (hackathon requirement)
- Limited to Hindi/English
- No real voice-to-text integration (simulated)
- No authentication (demo purposes)

## 🔮 Future Enhancements

- Real voice-to-text with AWS Transcribe
- Advanced ML classification with SageMaker
- Multi-language support (10+ regional languages)
- WhatsApp bot interface
- Integration with government portals (CPGRAMS)
- Predictive analytics
- Mobile app (React Native)
- Real-time notifications (SNS)
- Image upload support

## 🤝 Contributing

This is a hackathon project. For production use:
1. Implement proper authentication
2. Add real voice-to-text processing
3. Use ML models for classification
4. Add comprehensive error handling
5. Implement rate limiting
6. Add monitoring and logging

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

- Person A: Backend Development
- Person B: Frontend Development

## 🙏 Acknowledgments

- Built for GramVaani Hackathon
- Inspired by rural community needs
- Uses AWS serverless architecture

---

**Note**: This is a demo project using synthetic data. For production deployment, implement proper security, authentication, and data handling practices.
