import { NextFunction, Request, Response } from "express";
import baseConfig from "./config";
import { UserInputException } from "./exceptions";

function errorHandler(
  err: UserInputException,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message: err.message,
      stack: baseConfig.isDev && err.stack,
      path: req.originalUrl,
    },
  });
}

export { errorHandler };
