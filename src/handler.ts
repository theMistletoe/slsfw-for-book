import serverlessExpress from '@vendia/serverless-express';
import express from "express";
import { ScanInput, DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuidv4 } from 'uuid';

const app = express();

const TODO_TABLE = process.env.TODO_TABLE;
const dynamoDbClient = process.env.IS_OFFLINE ? new DocumentClient({
  apiVersion: '2012-08-10',
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
  secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
}) : new DocumentClient({
  apiVersion: '2012-08-10',
  // region: 'ap-northeast-1',
})

app.get("/", (_req, res, _next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/hello", (_req, res, _next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.get("/todos", async (_req, res, _next) => {
  const params: ScanInput = {
    TableName: TODO_TABLE!,
  };
  const response = await dynamoDbClient.scan(params).promise();
  console.log(JSON.stringify(response));

  return res.status(200).json({
    message: JSON.stringify(response),
  });
});

app.post("/todos", async (req, res, _next) => {
  const putParams: DocumentClient.PutItemInput = {
    TableName: TODO_TABLE!,
    Item: {
      id: uuidv4(),
      title: req.body.title,
      description: req.body.description
    },
    ReturnValues: 'ALL_OLD', // 同じプライマリキーの値があったら、過去の値を返す
    // ReturnConsumedCapacity: "TOTAL",
  };
  await dynamoDbClient.put(putParams).promise();

  return res.status(200).json({
    message: "succeed",
  });
});

app.use((_req, res, _next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverlessExpress({app});
