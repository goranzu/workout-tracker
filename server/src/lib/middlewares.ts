import { NextFunction, Request, Response } from "express";
import baseConfig from "../config";
import * as exceptions from "./exceptions";

function protect(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.session;
  try {
    if (!userId) {
      throw new exceptions.UnauthorizedException();
    }

    req.userId = userId;
    next();
  } catch (error) {
    next(error);
  }
}

function errorHandler(
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  //   console.log(err);
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

export { errorHandler, protect };
