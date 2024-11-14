"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class AppError extends mongoose_1.default.Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
        this.isOperational = true;
        this.status = this.statusCode.toString()[0] == "4" ? "fail" : "error";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
