"use strict";

const uuid = require("uuid");
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.postTodo = async (event, context, callback) => {
  const requestData = JSON.parse(event.body);

  if (!requestData || !requestData.title)
    callback(
      null,
      JSON.stringify({
        status: "error",
        message: "Request data or todo title is empty",
      })
    );

  const todo = {
    id: uuid.v4(),
    title: requestData.title,
  };

  insertTodo(todo)
    .then((res) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `${todo.title} inserted successfully`,
          candidateId: res.id,
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to insert todo ${todo.title}`,
        }),
      });
    });
};

module.exports.getTodos = async (event, context, callback) => {

  insertTodo(todo)
    .then((res) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `${todo.title} inserted successfully`,
          candidateId: res.id,
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to insert todo ${todo.title}`,
        }),
      });
    });
};

const insertTodo = (todo) => {
  console.log("Inserting todo");
  const todoInfo = {
    TableName: process.env.TODO_TABLE,
    Item: todo,
  };
  return dynamoDb
    .put(todoInfo)
    .promise()
    .then((res) => todo);
};
