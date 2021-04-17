import { NextFunction, Request, Response } from "express";
import baseConfig from "./config";

function errorHandler(
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong...";

  res.status(statusCode).json({
    error: {
      message,
      stack: baseConfig.isDev && err.stack,
      path: req.originalUrl,
    },
  });
  return;
}

export { errorHandler };
