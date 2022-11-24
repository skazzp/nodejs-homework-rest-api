const RequestError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

function tryCatchWrapper(request) {
  return async (req, res, next) => {
    try {
      await request(req, res, next);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = { RequestError, tryCatchWrapper };
