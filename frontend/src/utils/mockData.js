// Mock data for your dashboard
export const mockComplaints = [
  {
    id: 'C001',
    transcript: 'Paani ki tanki teen din se khaali hai',
    category: 'Water',
    urgency: 'High',
    village: 'Rampur',
    timestamp: '2024-03-06T10:30:00',
    status: 'Open'
  },
  {
    id: 'C002',
    transcript: 'Sadak mein bada gaddha hai',
    category: 'Road',
    urgency: 'High',
    village: 'Rampur',
    timestamp: '2024-03-06T09:15:00',
    status: 'Open'
  },
  {
    id: 'C003',
    transcript: 'Biji nahi aa rahi hai',
    category: 'Electricity',
    urgency: 'High',
    village: 'Shekhpur',
    timestamp: '2024-03-06T08:45:00',
    status: 'In Progress'
  },
  {
    id: 'C004',
    transcript: 'Nala jam gaya hai',
    category: 'Sanitation',
    urgency: 'Medium',
    village: 'Nagla',
    timestamp: '2024-03-06T11:20:00',
    status: 'Open'
  },
  {
    id: 'C005',
    transcript: 'Paani ki pipeline toot gayi',
    category: 'Water',
    urgency: 'High',
    village: 'Shekhpur',
    timestamp: '2024-03-06T07:30:00',
    status: 'Resolved'
  },
  {
    id: 'C006',
    transcript: 'School ke paas street light kharab',
    category: 'Electricity',
    urgency: 'Low',
    village: 'Rampur',
    timestamp: '2024-03-05T18:20:00',
    status: 'Open'
  },
  {
    id: 'C007',
    transcript: 'Ganda paani beh raha hai',
    category: 'Sanitation',
    urgency: 'High',
    village: 'Nagla',
    timestamp: '2024-03-05T14:10:00',
    status: 'In Progress'
  }
];

// Create unique lists for filters
export const villages = ['Rampur', 'Shekhpur', 'Nagla'];
export const categories = ['Water', 'Road', 'Electricity', 'Sanitation'];

// Also export as mockCategories if needed elsewhere
export const mockCategories = categories;
export const mockStats = {
  total: mockComplaints.length,
  open: mockComplaints.filter(c => c.status === 'Open').length,
  urgent: mockComplaints.filter(c => c.urgency === 'High').length,
  villages: villages.length
};