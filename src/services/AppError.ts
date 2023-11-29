import mongoose from "mongoose";

class AppError extends mongoose.Error {
  public statusCode;
  public status;
  public isOperational;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode || 500;
    this.isOperational = true;
    this.status = this.statusCode.toString()[0] == "4" ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
