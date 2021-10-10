const { sendResult, sendError } = require("../utils");
const { fetchTodo, fetchTodos } = require("../service");

module.exports.getTodo = (event, context, callback) => {
  const { id } = event.pathParameters;

  fetchTodo(id)
    .then((res) => {
      console.log(res);
      sendResult(callback, res.Item);
    })
    .catch((err) => {
      console.log(err);
      sendError(callback, `Unable to fetch todo ${id}`);
    });
};

module.exports.getTodos = (event, context, callback) => {
  fetchTodos()
    .then((res) => {
      console.log(res);
      sendResult(callback, res);
    })
    .catch((err) => {
      console.log(err);
      sendError(callback, `Unable to fetch todos`);
    });
};
