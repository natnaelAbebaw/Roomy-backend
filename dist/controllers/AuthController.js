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
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../services/AppError"));
const Controllers_1 = require("../services/Controllers");
const sendEmail_1 = require("../services/sendEmail");
const hotelModel_1 = require("../models/hotelModel");
class AuthController extends Controllers_1.Controller {
    tokenize(id, type) {
        return jsonwebtoken_1.default.sign({ id, type }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE_DATE,
        });
    }
    signup(model) {
        const controller = this;
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield model.create(req.body);
                const type = user.constructor.modelName;
                const token = controller.tokenize(user._id, type);
                res.status(201).json({ status: "success", user, token });
            });
        };
    }
    login(model) {
        const controller = this;
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(req.body);
                const { email, password } = req.body;
                if (!email || !password)
                    return next(new AppError_1.default("Please provide email and password", 400));
                const user = yield model
                    .findOne({
                    email,
                })
                    .select("+password");
                const isPasswordCorrect = yield (user === null || user === void 0 ? void 0 : user.compPasswords(password, user === null || user === void 0 ? void 0 : user.password));
                if (!user || !isPasswordCorrect) {
                    return next(new AppError_1.default("Incorrect user or password.", 400));
                }
                const type = user.constructor.modelName;
                const token = controller.tokenize(user._id, type);
                const hotel = yield hotelModel_1.HotelModel.find({ hotelAccount: user._id });
                res.status(200).json({ status: "success", user, token, hotel });
            });
        };
    }
    updateUserInfo(model) {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const data = req.body;
                data.password = undefined;
                data.confirmPassword = undefined;
                const updatedUser = yield model.findByIdAndUpdate(req.user.id, data, {
                    new: true,
                    runValidators: true,
                });
                res.status(200).json({ status: "success", updatedUser });
            });
        };
    }
    updatePassword(model) {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield model.findById(req.user.id).select("+password");
                const { password, newPassword, confirmNewPassword } = req.body;
                if (!user) {
                    return next(new AppError_1.default("User not found", 404));
                }
                if (!(yield user.compPasswords(password, user.password))) {
                    return next(new AppError_1.default("Incorrect password", 400));
                }
                user.password = newPassword;
                user.confirmPassword = confirmNewPassword;
                user.passwordChangeAt = Date.now();
                const updatedUser = yield user.save();
                res.status(200).json({ status: "success", updatedUser });
            });
        };
    }
    // forgot password
    forgetPassword(model) {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                // find user by email
                const user = yield model.findOne({ email: req.body.email });
                // if not user return error
                if (!user) {
                    return next(new AppError_1.default("There is no user found by this Email", 404));
                }
                // generate random token with crypto module
                const { resetToken, resetTokenHash } = user.createPasswordResetHash();
                // save token to user document
                user.passwordResetToken = resetTokenHash;
                const expireTime = process.env.RESET_PASSWORD_EXPIRE_TIME;
                user.passwordResetTokenExpiresAt = new Date(Date.now() + Number(expireTime));
                yield user.save({ validateBeforeSave: false });
                // send token to user email
                const subject = `Subject: Password Reset Request(${Number(expireTime) / 60000}mins)`;
                const type = user.constructor.modelName;
                const resetUrl = `${req.protocol}/${req.get("host")}/${type === "Guest" ? "guests" : "hotelAccounts"}/${user.id}/resetPassword/${resetToken}`;
                const message = `
      <div>
      <p>Hello ${user.userName}, 
      </br>
      We received a request to reset the password for your account. If you did not make this request, you can ignore this email.
       </br>
      To reset your password, please click on the following link: </br>
      
      <a href="${resetUrl}">${resetUrl}</a>
      </br>
      This link will expire in ${Number(expireTime) / 60000} mins, so please reset your password as soon as possible.
      </br>
      If you're having trouble clicking the link, you can copy and paste it into your browser.
      </br>
      Thank you,
      </br>
      hotelBooking.com
      </p></div>`;
                try {
                    yield (0, sendEmail_1.sendEmail)(user.email, subject, message);
                    res.status(200).json({
                        status: "success",
                        message: "Reset password link is send to your email.",
                    });
                }
                catch (err) {
                    user.passwordResetToken = undefined;
                    user.passwordResetTokenExpiresAt = undefined;
                    yield user.save();
                    next(new AppError_1.default("There is an error on sending email", 500));
                }
            });
        };
    }
    resetPassword(model) {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = req.params.userId;
                const token = req.params.token;
                const { newPassword, confirmNewPassword } = req.body;
                const user = yield model.findById(id);
                if (!user) {
                    return next(new AppError_1.default("User not found", 404));
                }
                const isCorrectToken = user.compResetToken(token, user.passwordResetToken);
                if (!isCorrectToken) {
                    return next(new AppError_1.default("Invalid password reset token.", 400));
                }
                if (user.passwordResetTokenExpiresAt < Date.now()) {
                    return next(new AppError_1.default("Password reset token expire. please get another token.", 400));
                }
                user.password = newPassword;
                user.confirmPassword = confirmNewPassword;
                user.passwordChangeAt = Date.now();
                user.passwordResetToken = undefined;
                user.passwordResetTokenExpiresAt = undefined;
                const updatedUser = yield user.save();
                res.status(200).json({ status: "success", user: updatedUser });
            });
        };
    }
    // delete me
    deleteMe(model) {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                yield model.findByIdAndDelete(req.user.id, { active: false });
                res.status(204).json({ status: "success", user: null });
            });
        };
    }
}
exports.AuthController = AuthController;
