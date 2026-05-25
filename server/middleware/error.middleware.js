export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route Not Found - ${req.originalUrl}`));
};

// eslint-safe production error handler
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,

    // ❌ never expose stack in production
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
