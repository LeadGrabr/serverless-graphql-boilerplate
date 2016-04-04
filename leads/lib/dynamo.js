import Promise from 'bluebird';
import AWS from 'aws-sdk';
import uuid from 'node-uuid';
const dynamoConfig = {
  sessionToken:    process.env.AWS_SESSION_TOKEN,
  region:          process.env.AWS_REGION
};
const docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);
const stage = process.env.SERVERLESS_STAGE;
const projectName = process.env.SERVERLESS_PROJECT_NAME;
const leadsTable = projectName + '-leads-' + stage;

export function createLead(post={}) {
  return new Promise(function(resolve, reject) {
    post.id = uuid.v1()

    var params = {
      TableName: leadsTable,
      Item: post
    };

    docClient.put(params, function(err, data) {
      if (err) return reject(err);
      return resolve(post);
    });

  });
}

export function getLeads() {
  return new Promise(function(resolve, reject) {
    var params = {
      TableName: leadsTable,
      AttributesToGet: [
        'id',
        'name',
        'email',
        'phone'
      ]
    };

    docClient.scan(params, function(err, data) {
      if (err) return reject(err);
      return resolve(data["Items"]);
    });

  });
}
