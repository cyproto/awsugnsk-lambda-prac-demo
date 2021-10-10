const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.insertTodo = (todo) => {
  console.log("Inserting todo");
  const todoInfo = {
    TableName: process.env.TODO_TABLE,
    Item: todo,
  };
  return dynamoDb
    .put(todoInfo)
    .promise();
};

module.exports.fetchTodo = async (todoId) => {
  console.log("Fetching todo");
  let params = { TableName: process.env.TODO_TABLE, Key: { id: todoId } };
  return dynamoDb.get(params).promise();
};

module.exports.fetchTodos = async () => {
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

module.exports.deleteTodo = async (todoId) => {
  console.log("Deleting todo");
  let params = { TableName: process.env.TODO_TABLE, Key: { id: todoId } };
  return dynamoDb.delete(params).promise();
};

module.exports.updateTodo = async (todo) => {
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
