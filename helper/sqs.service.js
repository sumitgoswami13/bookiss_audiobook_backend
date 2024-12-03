const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const sqs = new AWS.SQS();
const QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/123456789012/YourQueueName';

const sendToQueue = async (message) => {
  try {
    const messageBody = JSON.stringify(message);
    const params = {
      QueueUrl: QUEUE_URL,
      MessageBody: messageBody,
    };
    const result = await sqs.sendMessage(params).promise();
    console.log(`Message sent to SQS with MessageId: ${result.MessageId}`);
    return result;
  } catch (error) {
    console.error('Error sending message to SQS:', error);
    throw new Error('Failed to send message to SQS');
  }
};

module.exports = { sendToQueue };
