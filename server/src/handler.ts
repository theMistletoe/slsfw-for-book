import serverlessExpress from '@vendia/serverless-express';
import express from "express";
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import * as sourceMapSupport from "source-map-support";

sourceMapSupport.install();

const app = express();
const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

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

router.get("/", (_req, res, _next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

router.get("/hello", (_req, res, _next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

router.get("/todos", async (req, res, _next) => {
  const params: DocumentClient.QueryInput = {
    TableName: TODO_TABLE!,
    KeyConditionExpression: "#uid = :uid",
    ExpressionAttributeNames:{
      "#uid": "userId"
    },
    ExpressionAttributeValues: {
        ":uid": req.query.userid
    }
  };

  const response = await dynamoDbClient.query(params).promise();

  return res.status(200).json(response);
});

router.post("/todos", async (req, res, _next) => {
  const putParams: DocumentClient.PutItemInput = {
    TableName: TODO_TABLE!,
    Item: {
      userId: req.body.userid,
      todoId: uuidv4(),
      title: req.body.title,
      description: req.body.description
    },
    ReturnValues: 'ALL_OLD',
  };
  await dynamoDbClient.put(putParams).promise();

  return res.status(200).json({
    message: "succeed",
  });
});

router.use((_req, res, _next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

app.use('/', router)

export const handler = serverlessExpress({app});
