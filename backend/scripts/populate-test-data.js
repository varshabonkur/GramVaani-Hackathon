const AWS = require('aws-sdk');
const { testComplaints } = require('./test-data');

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined // For local DynamoDB
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || 'gramvaani-complaints';

async function populateData() {
  console.log(`Populating ${testComplaints.length} test complaints...`);

  for (const complaint of testComplaints) {
    try {
      await dynamodb.put({
        TableName: TABLE_NAME,
        Item: complaint
      }).promise();
      console.log(`✓ Added complaint ${complaint.id}`);
    } catch (error) {
      console.error(`✗ Failed to add complaint ${complaint.id}:`, error.message);
    }
  }

  console.log('\nData population complete!');
}

populateData().catch(console.error);
