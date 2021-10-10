module.exports.sendError = (callback, message) => {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      message: message,
    }),
  });
};

module.exports.sendResult = (callback, response) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      response: response,
    }),
  });
};
