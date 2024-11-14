"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const AppError_1 = __importDefault(require("./AppError"));
const mongoose_1 = __importDefault(require("mongoose"));
function errorSendToProd(error, res) {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
    });
}
function errorSendToDev(error, res) {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        error,
        stackTrace: error.stack,
    });
}
function globalErrorHandler(error, req, res, next) {
    const env = process.env.ENV;
    error.status = error.status || "error";
    error.statusCode = error.statusCode || 500;
    if (env === "dev")
        errorSendToDev(error, res);
    else {
        if (error.isOperational) {
            errorSendToProd(error, res);
        }
        else if (error instanceof mongoose_1.default.Error.CastError) {
            errorSendToProd(new AppError_1.default(`No resourse found by this Id:"${error.value._id}"`, 400), res);
        }
        else if (error.code === 11000) {
            errorSendToProd(new AppError_1.default(`A ${Object.keys(error.keyValue)[0]}  of "${Object.values(error.keyValue)[0]} "  is already used.`, 400), res);
        }
        else if (error instanceof mongoose_1.default.Error.ValidationError) {
            const messages = Object.keys(error.errors)
                .map((key) => error.errors[key])
                .toString();
            errorSendToProd(new AppError_1.default(messages, 400), res);
        }
        else if (error.name === "TokenExpiredError") {
            errorSendToProd(new AppError_1.default("Token has expired. please login agin", 401), res);
        }
        else if (error.name === "JsonWebTokenError") {
            errorSendToProd(new AppError_1.default("Invalid token signature. please login agin", 401), res);
        }
        else {
            errorSendToProd(new AppError_1.default("Something is very wrong.", 500), res);
        }
    }
}
exports.globalErrorHandler = globalErrorHandler;
