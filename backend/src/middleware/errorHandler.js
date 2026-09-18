export function notFound(req, res) {
  res.status(404).json({ success: false, error: "Route not found." });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error("[error]", err);

  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === "production";

  res.status(status).json({
    success: false,
    error:
      status === 500 && isProd
        ? "Something went wrong. Please try again."
        : err.publicMessage || err.message || "Unexpected error.",
  });
}

export class AppError extends Error {
  constructor(message, status = 400, publicMessage) {
    super(message);
    this.status = status;
    this.publicMessage = publicMessage || message;
  }
}
