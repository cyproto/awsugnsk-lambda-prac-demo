"use strict";

const uuid = require("uuid");

const utils = require("./utils");
const {
  insertTodo,
  fetchTodo,
  fetchTodos,
  deleteTodo,
  updateTodo,
} = require("./service");

module.exports.postTodo = (event, context, callback) => {
  const requestData = JSON.parse(event.body);

  if (!requestData || !requestData.title)
    utils.sendError(callback, "Request data or todo title is empty");

  const todo = {
    id: uuid.v4(),
    title: requestData.title,
  };

  insertTodo(todo)
    .then((res) => {
      utils.sendResult(callback, {
        message: `${todo.title} inserted successfully`,
      });
    })
    .catch((err) => {
      console.log(err);
      utils.sendError(callback, `Unable to insert todo ${todo.title}`);
    });
};

module.exports.getTodo = (event, context, callback) => {
  const { id } = event.pathParameters;

  fetchTodo(id)
    .then((res) => {
      console.log(res);
      utils.sendResult(callback, res);
    })
    .catch((err) => {
      console.log(err);
      utils.sendError(callback, `Unable to fetch todo ${id}`);
    });
};

module.exports.getTodos = (event, context, callback) => {
  fetchTodos()
    .then((res) => {
      console.log(res);
      utils.sendResult(callback, res);
    })
    .catch((err) => {
      console.log(err);
      utils.sendError(callback, `Unable to fetch todos`);
    });
};

module.exports.deleteTodo = (event, context, callback) => {
  const { id } = event.pathParameters;

  deleteTodo(id)
    .then((res) => {
      console.log(res);
      utils.sendResult(callback, `${id} inserted successfully`);
    })
    .catch((err) => {
      console.log(err);
      utils.sendError(callback, `Unable to delete todo ${id}`);
    });
};

module.exports.updateTodo = (event, context, callback) => {
  const requestData = JSON.parse(event.body);

  if (!requestData || !requestData.id || !requestData.title)
    utils.sendError(callback, "Request data or todo is empty");

  updateTodo(requestData)
    .then((res) => {
      console.log(res);
      utils.sendResult(callback, `${requestData.id} updated successfully`);
    })
    .catch((err) => {
      console.log(err);
      utils.sendError(callback, `Unable to update todo ${requestData.id}`);
    });
};
