export class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function notFound(req, res) {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} was not found.`,
  });
}

export function errorHandler(error, req, res, _next) {
  let statusCode = error.statusCode ?? 500;
  let message = error.message ?? "Something went wrong on the server.";

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "The submitted data is invalid.";
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = "A provided identifier is not valid.";
  }

  if (statusCode >= 500) {
    console.error(`[api] ${req.method} ${req.originalUrl}`, error);
    if (process.env.NODE_ENV === "production") {
      message = "Something went wrong on the server.";
    }
  }

  res.status(statusCode).json({
    message,
    ...(error.details ? { details: error.details } : {}),
  });
}
