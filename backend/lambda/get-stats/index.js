const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || 'gramvaani-complaints';

exports.handler = async (event) => {
  try {
    const result = await dynamodb.scan({
      TableName: TABLE_NAME
    }).promise();

    const complaints = result.Items;

    // Calculate statistics
    const stats = {
      total: complaints.length,
      open: complaints.filter(c => c.status === 'Open').length,
      inProgress: complaints.filter(c => c.status === 'In Progress').length,
      resolved: complaints.filter(c => c.status === 'Resolved').length,
      urgent: complaints.filter(c => c.urgency === 'High').length,
      villages: [...new Set(complaints.map(c => c.village))].length
    };

    // Category breakdown
    const categoryBreakdown = {};
    complaints.forEach(c => {
      categoryBreakdown[c.category] = (categoryBreakdown[c.category] || 0) + 1;
    });

    // Village breakdown
    const villageBreakdown = {};
    complaints.forEach(c => {
      villageBreakdown[c.village] = (villageBreakdown[c.village] || 0) + 1;
    });

    // Urgency breakdown
    const urgencyBreakdown = {
      High: complaints.filter(c => c.urgency === 'High').length,
      Medium: complaints.filter(c => c.urgency === 'Medium').length,
      Low: complaints.filter(c => c.urgency === 'Low').length
    };

    // Trend data (last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentComplaints = complaints.filter(c => new Date(c.timestamp) >= sevenDaysAgo);
    
    const trendData = {};
    recentComplaints.forEach(c => {
      const date = new Date(c.timestamp).toISOString().split('T')[0];
      trendData[date] = (trendData[date] || 0) + 1;
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        stats,
        categoryBreakdown,
        villageBreakdown,
        urgencyBreakdown,
        trendData
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
