# Design Document - GramVaani

## 1. High-Level Architecture

### 1.1 Architecture Diagram

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Input Layer    │────▶│ Processing Layer │────▶│  Output Layer   │
├─────────────────┤     ├──────────────────┤     ├─────────────────┤
│ - Voice Input   │     │ - Speech-to-Text │     │ - Admin Dashboard│
│ - Text Input    │     │ - Sentiment      │     │ - Heat Maps     │
│ - SMS Gateway   │     │   Analysis       │     │ - Trend Charts  │
│   (Simulated)   │     │ - Issue          │     │ - Summary Reports│
└─────────────────┘     │   Classification │     └─────────────────┘
                        │ - Data Cleaning  │
                        └──────────────────┘
                                 │
                                 │
                                 ▼
                   ┌─────────────────────────────────────┐
                   │         Data Storage                │
                   │      (CSV Files / SQLite)           │
                   └─────────────────────────────────────┘
```

## 2. Data Flow

1. **User Submission** → Voice/Text recorded → Sent to backend
2. **Preprocessing** → Audio converted to text → Text cleaned
3. **Analysis** →
   - Sentiment score calculated
   - Issue category identified (ML classifier)
   - Location extracted
4. **Storage** → Structured data saved to database
5. **Visualization** → Data pulled for dashboard rendering

## 3. Detailed Component Design

### 3.1 Data Generator Module
- **Purpose**: Create synthetic data for demonstration
- **Implementation**: Python script using Faker library
- **Output**: CSV files with columns [timestamp, village, issue_type, description, sentiment]

### 3.2 Voice Processing Module
- **Purpose**: Convert speech to text
- **Implementation**:
  - Option A: OpenAI Whisper (offline-capable)
  - Option B: Google Speech-to-Text API
- **Fallback**: Text input for low-bandwidth scenarios

### 3.3 NLP Classification Module
- **Purpose**: Categorize complaints and detect urgency
- **Implementation**:
  - Use pre-trained BERT model fine-tuned on Hindi/English
  - Define 5 categories: Water, Road, Electricity, Sanitation, Health
  - Urgency scoring: Keywords like "emergency", "broken", "no water" → high priority

### 3.4 Analytics Module
- **Purpose**: Generate insights from complaint data
- **Implementation**:
  - Time series analysis (Pandas)
  - Geospatial clustering (Folium/Leaflet)
  - Trend detection (rolling averages)

### 3.5 Dashboard Module
- **Purpose**: Visualize data for administrators
- **Implementation**: Streamlit with 4 tabs
  - Tab 1: Overview Map
  - Tab 2: Trend Analysis
  - Tab 3: Department-wise Breakdown
  - Tab 4: Raw Data Viewer

## 4. Data Storage Design

### 4.1 Table: complaints

| Column        | Type     | Description                          |
|---------------|----------|--------------------------------------|
| id            | INTEGER  | Primary key                          |
| timestamp     | DATETIME | When complaint was filed             |
| village       | TEXT     | Village name                         |
| block         | TEXT     | Block/District                       |
| issue_type    | TEXT     | water/road/electricity/sanitation/health |
| description   | TEXT     | Raw text/transcribed complaint       |
| sentiment     | FLOAT    | -1 to +1 score                       |
| urgency_score | INTEGER  | 1-5 (5 = most urgent)                |
| status        | TEXT     | pending/in-progress/resolved         |
| source        | TEXT     | voice/text                           |

## 5. API Endpoints

- `POST /api/complaint` → Submit new complaint
- `GET /api/complaints?village=X` → Get complaints by location
- `GET /api/analytics/trends` → Get time-series data
- `GET /api/analytics/hotspots` → Get geo-clusters

## 6. UI/UX Design

### 6.1 User Flow
1. User lands on homepage → Selects input method (mic or text)
2. Records message → Receives confirmation
3. Admin logs in → Views dashboard
4. Clicks on hotspot → Sees detailed complaints
5. Updates status → Marks resolved

### 6.2 Wireframe Description
- Mobile-first design
- Large buttons for voice input
- Simple confirmation messages
- Dashboard with filters by date/village/department

## 7. Machine Learning Design

### 7.1 Sentiment Analysis
- **Model**: DistilBERT (lightweight) or TextBlob (simpler)
- **Training Data**: Synthetic Hindi/English sentences with sentiment labels
- **Accuracy Target**: >80% on test set

### 7.2 Issue Classification
- **Model**: Multinomial Naive Bayes or TinyBERT
- **Features**: TF-IDF vectors of complaint text
- **Classes**: 5 issue types

### 7.3 Urgency Detection
- **Rule-based + ML hybrid**:
  - Rule: Contains "emergency" → Urgency=5
  - ML: Train classifier on urgency levels using synthetic data

## 8. Limitations and Assumptions

- **Data**: Using synthetic data only (as per hackathon rules)
- **Language**: Limited to Hindi/English (can extend to more languages)
- **Scale**: Designed for district-level (10-50 villages)
- **Connectivity**: Assumes intermittent internet access

## 9. Future Enhancements

- Integration with government grievance portals (CPGRAMS)
- WhatsApp bot interface
- Multi-language support (10+ regional languages)
- Predictive analytics (predict which villages will have water issues next month)
