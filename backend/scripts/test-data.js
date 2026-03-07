// Test data for populating DynamoDB
const testComplaints = [
  {
    id: 'C001',
    transcript: 'Paani ki tanki teen din se khaali hai',
    category: 'Water',
    urgency: 'High',
    village: 'Rampur',
    timestamp: '2024-03-06T10:30:00Z',
    status: 'Open',
    sentiment: -0.6,
    audioUrl: null,
    source: 'text'
  },
  {
    id: 'C002',
    transcript: 'Sadak mein bada gaddha hai',
    category: 'Road',
    urgency: 'High',
    village: 'Rampur',
    timestamp: '2024-03-06T09:15:00Z',
    status: 'Open',
    sentiment: -0.5,
    audioUrl: null,
    source: 'text'
  },
  {
    id: 'C003',
    transcript: 'Biji nahi aa rahi hai',
    category: 'Electricity',
    urgency: 'High',
    village: 'Shekhpur',
    timestamp: '2024-03-06T08:45:00Z',
    status: 'In Progress',
    sentiment: -0.3,
    audioUrl: null,
    source: 'text'
  },
  {
    id: 'C004',
    transcript: 'Nala jam gaya hai',
    category: 'Sanitation',
    urgency: 'Medium',
    village: 'Nagla',
    timestamp: '2024-03-06T11:20:00Z',
    status: 'Open',
    sentiment: -0.6,
    audioUrl: null,
    source: 'text'
  },
  {
    id: 'C005',
    transcript: 'Paani ki pipeline toot gayi',
    category: 'Water',
    urgency: 'High',
    village: 'Shekhpur',
    timestamp: '2024-03-06T07:30:00Z',
    status: 'Resolved',
    sentiment: -0.6,
    audioUrl: null,
    source: 'text'
  },
  {
    id: 'C006',
    transcript: 'School ke paas street light kharab',
    category: 'Electricity',
    urgency: 'Low',
    village: 'Rampur',
    timestamp: '2024-03-05T18:20:00Z',
    status: 'Open',
    sentiment: -0.3,
    audioUrl: null,
    source: 'text'
  },
  {
    id: 'C007',
    transcript: 'Ganda paani beh raha hai',
    category: 'Sanitation',
    urgency: 'High',
    village: 'Nagla',
    timestamp: '2024-03-05T14:10:00Z',
    status: 'In Progress',
    sentiment: -0.6,
    audioUrl: null,
    source: 'text'
  },
  {
    id: 'C008',
    transcript: 'Hand pump kharab ho gaya hai',
    category: 'Water',
    urgency: 'High',
    village: 'Rampur',
    timestamp: '2024-03-05T12:00:00Z',
    status: 'Open',
    sentiment: -0.6,
    audioUrl: null,
    source: 'voice'
  },
  {
    id: 'C009',
    transcript: 'Main road par light nahi hai',
    category: 'Electricity',
    urgency: 'Medium',
    village: 'Shekhpur',
    timestamp: '2024-03-04T19:30:00Z',
    status: 'Open',
    sentiment: -0.3,
    audioUrl: null,
    source: 'text'
  },
  {
    id: 'C010',
    transcript: 'Kachra nahi uthaya ja raha',
    category: 'Sanitation',
    urgency: 'Medium',
    village: 'Nagla',
    timestamp: '2024-03-04T10:15:00Z',
    status: 'Open',
    sentiment: -0.3,
    audioUrl: null,
    source: 'text'
  }
];

module.exports = { testComplaints };
