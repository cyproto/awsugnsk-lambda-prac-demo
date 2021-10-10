const { sendResult, sendError } = require("../utils");
const { updateTodo } = require("../service");

module.exports.updateTodo = (event, context, callback) => {
  const requestData = JSON.parse(event.body);

  if (!requestData || !requestData.id || !requestData.title)
    sendError(callback, "Request data or todo is empty");

  updateTodo(requestData)
    .then((res) => {
      console.log(res);
      sendResult(callback, `${requestData.id} updated successfully`);
    })
    .catch((err) => {
      console.log(err);
      sendError(callback, `Unable to update todo ${requestData.id}`);
    });
};
