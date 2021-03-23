import { Request, Response } from "express";
import baseConfig from "./config";
import { BaseException } from "./exceptions";

function errorHandler(err: BaseException, req: Request, res: Response): void {
  const statusCode = err.statusCode || 500;

  console.log(err);

  res.status(statusCode).json({
    error: {
      message: err.message,
      stack: baseConfig.isDev && err.stack,
      path: req.originalUrl,
    },
  });
  return;
}

export { errorHandler };
