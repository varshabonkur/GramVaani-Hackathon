# GramVaani API Documentation

## Overview

The GramVaani API provides endpoints for submitting and retrieving rural community complaints. The API uses REST principles and returns JSON responses.

**Base URL**: `https://api.gramvaani.example.com/v1`

## Authentication

Currently, the API does not require authentication (for hackathon demo purposes). In production, implement API keys or OAuth 2.0.

## Endpoints

### 1. Submit Complaint

Submit a new voice or text complaint.

**Endpoint**: `POST /complaints`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "transcript": "Paani ki tanki teen din se khaali hai",
  "village": "Rampur",
  "audioUrl": "https://s3.amazonaws.com/bucket/audio123.mp3"
}
```

**Parameters**:
- `transcript` (required, string): Text of the complaint
- `village` (required, string): Village name
- `audioUrl` (optional, string): S3 URL of audio file

**Response** (200 OK):
```json
{
  "success": true,
  "complaint": {
    "id": "C1709721000000",
    "transcript": "Paani ki tanki teen din se khaali hai",
    "category": "Water",
    "urgency": "High",
    "village": "Rampur",
    "timestamp": "2024-03-06T10:30:00Z",
    "status": "Open",
    "sentiment": -0.6,
    "audioUrl": "https://s3.amazonaws.com/bucket/audio123.mp3",
    "source": "voice"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Missing required fields: transcript, village"
}
```

---

### 2. Get Complaints

Retrieve complaints with optional filters.

**Endpoint**: `GET /complaints`

**Query Parameters**:
- `village` (optional): Filter by village name (e.g., "Rampur")
- `category` (optional): Filter by category (Water, Road, Electricity, Sanitation, Health, Other)
- `status` (optional): Filter by status (Open, In Progress, Resolved)
- `limit` (optional, default: 100): Maximum number of results

**Example Requests**:
```
GET /complaints
GET /complaints?village=Rampur
GET /complaints?category=Water&status=Open
GET /complaints?village=Rampur&limit=50
```

**Response** (200 OK):
```json
{
  "complaints": [
    {
      "id": "C001",
      "transcript": "Paani ki tanki teen din se khaali hai",
      "category": "Water",
      "urgency": "High",
      "village": "Rampur",
      "timestamp": "2024-03-06T10:30:00Z",
      "status": "Open",
      "sentiment": -0.6,
      "audioUrl": null,
      "source": "text"
    },
    {
      "id": "C002",
      "transcript": "Sadak mein bada gaddha hai",
      "category": "Road",
      "urgency": "High",
      "village": "Rampur",
      "timestamp": "2024-03-06T09:15:00Z",
      "status": "Open",
      "sentiment": -0.5,
      "audioUrl": null,
      "source": "text"
    }
  ],
  "count": 2
}
```

---

### 3. Get Statistics

Retrieve aggregated statistics and analytics.

**Endpoint**: `GET /stats`

**Response** (200 OK):
```json
{
  "stats": {
    "total": 50,
    "open": 30,
    "inProgress": 10,
    "resolved": 10,
    "urgent": 15,
    "villages": 5
  },
  "categoryBreakdown": {
    "Water": 20,
    "Road": 15,
    "Electricity": 8,
    "Sanitation": 5,
    "Health": 2
  },
  "villageBreakdown": {
    "Rampur": 20,
    "Shekhpur": 18,
    "Nagla": 12
  },
  "urgencyBreakdown": {
    "High": 15,
    "Medium": 25,
    "Low": 10
  },
  "trendData": {
    "2024-03-01": 5,
    "2024-03-02": 8,
    "2024-03-03": 6,
    "2024-03-04": 7,
    "2024-03-05": 9,
    "2024-03-06": 10
  }
}
```

---

## Data Models

### Complaint Object

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique complaint ID (e.g., "C1709721000000") |
| transcript | string | Text of the complaint |
| category | string | Auto-classified category (Water, Road, Electricity, Sanitation, Health, Other) |
| urgency | string | Auto-detected urgency (High, Medium, Low) |
| village | string | Village name |
| timestamp | string (ISO 8601) | When complaint was submitted |
| status | string | Current status (Open, In Progress, Resolved) |
| sentiment | number | Sentiment score (-1 to 1, negative = complaint) |
| audioUrl | string or null | S3 URL of audio file |
| source | string | Input method (voice or text) |

### Statistics Object

| Field | Type | Description |
|-------|------|-------------|
| stats.total | number | Total number of complaints |
| stats.open | number | Number of open complaints |
| stats.inProgress | number | Number of in-progress complaints |
| stats.resolved | number | Number of resolved complaints |
| stats.urgent | number | Number of high-urgency complaints |
| stats.villages | number | Number of unique villages |
| categoryBreakdown | object | Count by category |
| villageBreakdown | object | Count by village |
| urgencyBreakdown | object | Count by urgency level |
| trendData | object | Daily complaint counts (last 7 days) |

---

## Classification Logic

### Category Detection
The system uses keyword matching to classify complaints:

- **Water**: paani, water, tanki, pipeline, hand pump
- **Road**: sadak, road, gaddha (pothole)
- **Electricity**: biji, electricity, light, street light
- **Sanitation**: nala (drain), sanitation, ganda (dirty), kachra (garbage)
- **Health**: health, hospital, doctor

### Urgency Detection
High urgency is assigned if the transcript contains:
- emergency, urgent
- kharab (broken), toot (broken), jam (blocked)
- nahi (not working)

### Sentiment Analysis
Sentiment score is calculated based on negative keywords:
- Each negative word reduces score by 0.3
- Keywords: kharab, toot, jam, nahi, ganda, problem
- Score range: -1 (very negative) to 1 (positive)

---

## Error Handling

### HTTP Status Codes

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters
- `500 Internal Server Error`: Server error

### Error Response Format
```json
{
  "error": "Error message description"
}
```

---

## Rate Limiting

Currently no rate limiting (demo purposes). In production, implement:
- 100 requests per minute per IP
- 1000 requests per hour per API key

---

## CORS

All endpoints support CORS with the following headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Examples

### cURL Examples

**Submit a complaint**:
```bash
curl -X POST https://api.gramvaani.example.com/v1/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Paani ki tanki kharab hai",
    "village": "Rampur"
  }'
```

**Get all complaints**:
```bash
curl https://api.gramvaani.example.com/v1/complaints
```

**Get complaints for a village**:
```bash
curl "https://api.gramvaani.example.com/v1/complaints?village=Rampur"
```

**Get statistics**:
```bash
curl https://api.gramvaani.example.com/v1/stats
```

### JavaScript Examples

**Submit a complaint**:
```javascript
const response = await fetch('https://api.gramvaani.example.com/v1/complaints', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transcript: 'Paani ki tanki kharab hai',
    village: 'Rampur'
  })
});
const data = await response.json();
console.log(data.complaint);
```

**Get complaints**:
```javascript
const response = await fetch('https://api.gramvaani.example.com/v1/complaints?village=Rampur');
const data = await response.json();
console.log(data.complaints);
```

---

## Postman Collection

Import the Postman collection from `docs/POSTMAN_COLLECTION.json` for easy API testing.

---

## Support

For issues or questions, contact the GramVaani team.
