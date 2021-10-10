const { sendResult, sendError } = require("../utils");
const { deleteTodo } = require("../service");

module.exports.deleteTodo = (event, context, callback) => {
  const { id } = event.pathParameters;

  deleteTodo(id)
    .then((res) => {
      console.log(res);
      sendResult(callback, `${id} deleted successfully`);
    })
    .catch((err) => {
      console.log(err);
      sendError(callback, `Unable to delete todo ${id}`);
    });
};
