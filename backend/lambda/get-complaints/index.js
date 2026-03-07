const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || 'gramvaani-complaints';

exports.handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};
    const { village, category, status, limit = '100' } = queryParams;

    let params = {
      TableName: TABLE_NAME,
      Limit: parseInt(limit)
    };

    // Scan with filters
    const result = await dynamodb.scan(params).promise();
    let items = result.Items;

    // Apply filters
    if (village && village !== 'All') {
      items = items.filter(item => item.village === village);
    }
    if (category && category !== 'All') {
      items = items.filter(item => item.category === category);
    }
    if (status && status !== 'All') {
      items = items.filter(item => item.status === status);
    }

    // Sort by timestamp (newest first)
    items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        complaints: items,
        count: items.length
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
