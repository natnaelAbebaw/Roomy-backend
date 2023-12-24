import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";
import mongoose from "mongoose";
import { MongoServerError } from "mongodb";

type CustomError = AppError & MongoServerError;

function errorSendToProd(error: AppError, res: Response) {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
}

function errorSendToDev(error: AppError, res: Response) {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error,
    stackTrace: error.stack,
  });
}
export function globalErrorHandler(
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const env = process.env.ENV;
  error.status = error.status || "error";
  error.statusCode = error.statusCode || 500;
  if (env === "dev") errorSendToDev(error, res);
  else {
    if (error.isOperational) {
      errorSendToProd(error, res);
    } else if (error instanceof mongoose.Error.CastError) {
      errorSendToProd(
        new AppError(`No resourse found by this Id:"${error.value._id}"`, 400),
        res
      );
    } else if (error.code === 11000) {
      errorSendToProd(
        new AppError(
          `A ${Object.keys(error.keyValue)[0]}  of "${
            Object.values(error.keyValue)[0]
          } "  is already used.`,
          400
        ),
        res
      );
    } else if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.keys(error.errors)
        .map((key) => error.errors[key])
        .toString();

      errorSendToProd(new AppError(messages, 400), res);
    } else if (error.name === "TokenExpiredError") {
      errorSendToProd(
        new AppError("Token has expired. please login agin", 401),
        res
      );
    } else if (error.name === "JsonWebTokenError") {
      errorSendToProd(
        new AppError("Invalid token signature. please login agin", 401),
        res
      );
    } else {
      errorSendToProd(new AppError("Something is very wrong.", 500), res);
    }
  }
}
