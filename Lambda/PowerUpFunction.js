
// Import the AWS SDK 
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

// Create DynamoDB service object
const dynamodb = new DynamoDBClient();

// Get reference to table
const table = 'PowerUpDatabase';

// Handler function
exports.handler = async (event) => {
  
  // Get input numbers 
  const base = event.base;
  const exponent = event.exponent;
  
  // Calculate result
  const mathResult = Math.pow(base, exponent);

  // Get current time
  const now = new Date().toUTCString();

  // Write to DynamoDB
  const params = {
    TableName: table,
    Item: {
      ID: { S: mathResult.toString() },
      LatestGreetingTime: { S: now }
    }
  };

  try {
    await dynamodb.send(new PutItemCommand(params));

    // Return response
    return {
      statusCode: 200,
      body: JSON.stringify(`Result is ${mathResult}`)
    };

  } catch (err) {
    console.log('DynamoDB error: ', err);
    return {
      statusCode: 500,
      body: JSON.stringify('Failed to write to database.')
    };
  }
};