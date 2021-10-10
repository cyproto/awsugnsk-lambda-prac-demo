const { sendResult, sendError } = require("../utils");
const { insertTodo } = require("../service");

const uuid = require("uuid");

module.exports.postTodo = (event, context, callback) => {
  const requestData = JSON.parse(event.body);

  if (!requestData || !requestData.title)
    sendError(callback, "Request data or todo title is empty");

  const todo = {
    id: uuid.v4(),
    title: requestData.title,
  };

  insertTodo(todo)
    .then((res) => {
      sendResult(callback, {
        message: `${todo.title} inserted successfully`,
      });
    })
    .catch((err) => {
      console.log(err);
      sendError(callback, `Unable to insert todo ${todo.title}`);
    });
};
