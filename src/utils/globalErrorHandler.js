const globalErrorHandler = (err, req, res, next) => {
  res.status(err.status).json({ error: err.message, stack: err.stack });
};

export default globalErrorHandler;
