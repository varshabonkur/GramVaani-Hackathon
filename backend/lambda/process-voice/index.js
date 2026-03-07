const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || 'gramvaani-complaints';

// Simple keyword-based classification
const classifyIssue = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('paani') || lower.includes('water') || lower.includes('tanki') || lower.includes('pipeline')) return 'Water';
  if (lower.includes('sadak') || lower.includes('road') || lower.includes('gaddha')) return 'Road';
  if (lower.includes('biji') || lower.includes('electricity') || lower.includes('light')) return 'Electricity';
  if (lower.includes('nala') || lower.includes('sanitation') || lower.includes('ganda')) return 'Sanitation';
  if (lower.includes('health') || lower.includes('hospital') || lower.includes('doctor')) return 'Health';
  return 'Other';
};

// Simple urgency detection
const detectUrgency = (text) => {
  const lower = text.toLowerCase();
  const urgentKeywords = ['emergency', 'urgent', 'kharab', 'toot', 'jam', 'nahi'];
  const hasUrgent = urgentKeywords.some(keyword => lower.includes(keyword));
  return hasUrgent ? 'High' : 'Medium';
};

// Simple sentiment analysis (-1 to 1)
const analyzeSentiment = (text) => {
  const lower = text.toLowerCase();
  const negativeWords = ['kharab', 'toot', 'jam', 'nahi', 'ganda', 'problem'];
  const negativeCount = negativeWords.filter(word => lower.includes(word)).length;
  return Math.max(-1, -0.3 * negativeCount);
};

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { transcript, village, audioUrl } = body;

    if (!transcript || !village) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing required fields: transcript, village' })
      };
    }

    const category = classifyIssue(transcript);
    const urgency = detectUrgency(transcript);
    const sentiment = analyzeSentiment(transcript);
    const timestamp = new Date().toISOString();
    const id = `C${Date.now()}`;

    const item = {
      id,
      transcript,
      category,
      urgency,
      village,
      timestamp,
      status: 'Open',
      sentiment,
      audioUrl: audioUrl || null,
      source: audioUrl ? 'voice' : 'text'
    };

    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: item
    }).promise();

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        complaint: item
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
