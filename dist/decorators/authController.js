"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictToFunc = exports.protectFunc = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accounts_1 = require("./accounts");
const hotelAccount_1 = require("../models/hotelAccount");
const guestModel_1 = require("../models/guestModel");
const AppError_1 = __importDefault(require("../services/AppError"));
const rolesModel_1 = require("../models/rolesModel");
function protectFunc(protect) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) {
                    return next(new AppError_1.default("You must be logged in to access this feature. Please log in or create an account to continue.", 401));
                }
                const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                if (!decode) {
                    return next(new AppError_1.default("Invalid token. Please log in or create an account to continue.", 401));
                }
                if (protect !== accounts_1.accounts.all && decode.type !== protect) {
                    return next(new AppError_1.default(`You are not a valid candidate for this operation. This is reserved to: ${protect}. Please create a ${protect} to continue.`, 401));
                }
                const model = decode.type === "HotelAccount" ? hotelAccount_1.HotelAccountModel : guestModel_1.GuestModel;
                const user = yield model.findById(decode.id).select("+passwordChangeAt");
                if (!user) {
                    return next(new AppError_1.default("Your account was Deleted a few time ago. Please create an account to continue.", 401));
                }
                const passwordChangeAt = +new Date(user.passwordChangeAt).getTime() / 1000;
                const tokenIssuedAt = +new Date(decode.iat).getTime();
                if (passwordChangeAt > tokenIssuedAt) {
                    return next(new AppError_1.default("You have changed your password recently. Please log in to continue.", 401));
                }
                req.user = user;
                next();
            }
            catch (err) {
                next(err);
            }
        });
    };
}
exports.protectFunc = protectFunc;
function restrictToFunc(restrictTo) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!req.user) {
                    return next(new AppError_1.default("You must be logged in to access this feature. Please log in or create an account to continue.", 401));
                }
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const hotelId = req.params.hotelId;
                const candidateRole = yield rolesModel_1.RolesModel.findOne({
                    hotelAccount: userId,
                    hotel: hotelId,
                });
                const isAuthorize = restrictTo.some((role) => (candidateRole === null || candidateRole === void 0 ? void 0 : candidateRole.role) === role);
                if (!candidateRole || !isAuthorize) {
                    return next(new AppError_1.default("You are not authorized to access this feature.", 403));
                }
                next();
            }
            catch (err) {
                next(err);
            }
        });
    };
}
exports.restrictToFunc = restrictToFunc;
