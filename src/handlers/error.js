// this is to clean the html error into a json type error
function errorHandler(err, req, res, next) {
  // return 500 if route is found, but have server error
  return res.status(err.status || 500).json({
    error: {
      message: err.message || "Something went wrong.",
    },
  });
}

export default errorHandler;

