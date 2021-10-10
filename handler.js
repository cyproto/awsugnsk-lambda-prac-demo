"use strict";

const { postTodo } = require("./api/post");
const { getTodo, getTodos } = require("./api/get");
const { updateTodo } = require("./api/put");
const { deleteTodo } = require("./api/delete");

module.exports.handle = (event, context, callback) => {
  switch (event.httpMethod) {
    case "GET":
      event.resource === "/getTodos"
        ? getTodos(event, context, callback)
        : getTodo(event, context, callback);
      break;
    case "PUT":
      updateTodo(event, context, callback);
      break;
    case "POST":
      postTodo(event, context, callback);
      break;
    case "DELETE":
      deleteTodo(event, context, callback);
      break;
    default:
      // Automatically handled by api gateway
  }
};
