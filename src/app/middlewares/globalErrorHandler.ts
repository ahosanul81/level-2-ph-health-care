import { trace } from "console";
import { NextFunction, Request, Response } from "express";
import path from "path";

export class AppError extends Error {
  public statusCode: number;
  public message: string;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);

  let statusCode = 500;
  let message = error.message || "Something went wrong";
  let errorSources = [{ path: "", message: "Something went wrong" }];

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorSources = [{ path: "", message: error.message }];
  }

  res.status(statusCode).send({
    success: false,
    statusCode,
    message,
    errorSources,
  });
};
