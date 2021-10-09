"use strict";

const uuid = require("uuid");
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.postTodo = (event, context, callback) => {
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

module.exports.getTodos = (event, context, callback) => {
  fetchTodos()
    .then((res) => {
      console.log(res);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          res,
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to fetch todos`,
        }),
      });
    });
};

module.exports.deleteTodo = (event, context, callback) => {
  const { id } = event.pathParameters;

  deleteTodo(id)
    .then((res) => {
      console.log(res);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          res,
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to delete todo ${id}`,
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

const fetchTodos = async () => {
  console.log("Fetching all todos");
  let params = { TableName: process.env.TODO_TABLE };
  let allTodos = [];
  let todos;
  do {
    todos = await dynamoDb.scan(params).promise();
    todos.Items.forEach((todo) => allTodos.push(todo));
    params.ExclusiveStartKey = todos.LastEvaluatedKey;
  } while (typeof todos.LastEvaluatedKey != "undefined");
  console.log(allTodos);
  return allTodos;
};

const deleteTodo = async (todoId) => {
  let params = { TableName: process.env.TODO_TABLE, Key: { id: todoId } };
  return dynamoDb
    .delete(params)
    .promise();
};
