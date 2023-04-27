'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-1' });
const { Consumer } = require('sqs-consumer');
const sns = new AWS.SNS();
const queueUrl = 'https://sqs.us-west-1.amazonaws.com/872392660173/vendor1'
const order = { orderId: 45664, customer: "Tom", vendorUrl: queueUrl}
const pickupTopic = 'arn:aws:sns:us-west-1:872392660173:pickup.fifo';

const payload = {
  MessageGroupId: '1',
  Message: JSON.stringify(order),
  TopicArn: pickupTopic
}

setInterval(() => {sns.publish(payload).promise()
.then(data => {
  console.log("sent order", data);
})
.catch((e) => {
  console.log('SNS vender error: ', e);
})},10000);





const app = Consumer.create({
  region: 'us-west-1',
  queueUrl: 'https://sqs.us-west-1.amazonaws.com/872392660173/vendor1',
  handleMessage: async (order) => {
    let data = JSON.parse(order.Body);
    console.log('vender received package', data);
  },
});

app.start();