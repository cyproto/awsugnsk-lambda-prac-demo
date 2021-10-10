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

module.exports.getTodo = (event, context, callback) => {
  const { id } = event.pathParameters;

  getTodo(id)
    .then((res) => {
      console.log(res);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          todo: res,
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to fetch todo ${id}`,
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
          todos: res,
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
          message: `${id} inserted successfully`,
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

module.exports.updateTodo = (event, context, callback) => {
  const requestData = JSON.parse(event.body);

  if (!requestData || !requestData.id || !requestData.title)
    callback(
      null,
      JSON.stringify({
        status: "error",
        message: "Request data or todo is empty",
      })
    );

  updateTodo(requestData)
    .then((res) => {
      console.log(res);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `${requestData.id} updated successfully`,
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to update todo ${requestData.id}`,
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

const getTodo = async (todoId) => {
  console.log("Fetching todo");
  let params = { TableName: process.env.TODO_TABLE, Key: { id: todoId } };
  return dynamoDb.get(params).promise();
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
  console.log("Deleting todo");
  let params = { TableName: process.env.TODO_TABLE, Key: { id: todoId } };
  return dynamoDb.delete(params).promise();
};

const updateTodo = async (todo) => {
  console.log("Updating todo");
  let params = {
    TableName: process.env.TODO_TABLE,
    Key: { id: todo.id },
    UpdateExpression: "set title = :titleVal",
    ExpressionAttributeValues: {
      ":titleVal": todo.title,
    },
  };
  return dynamoDb.update(params).promise();
};
