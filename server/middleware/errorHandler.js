function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  console.error(`[${new Date().toISOString()}] ${status} ${req.method} ${req.path} — ${message}`);

  res.status(status).json({
    error: {
      status,
      message,
    },
  });
}

module.exports = errorHandler;
