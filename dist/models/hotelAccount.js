"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelAccountModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const utils_1 = require("../services/utils");
const HotelAccountSchema = new mongoose_1.default.Schema({
    userName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        validate: [validator_1.default.isEmail, "invalid email"],
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "password must be at least 8 characters"],
        select: false,
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: "passwords are not the same",
        },
    },
    passwordChangeAt: {
        type: Date,
        required: true,
        default: Date.now(),
        select: false,
    },
    passwordResetToken: String,
    passwordResetTokenExpiresAt: Date,
    active: { type: Boolean, default: true },
}, { timestamps: true });
HotelAccountSchema.pre("save", utils_1.hashPassword);
HotelAccountSchema.pre(/^find/, function () {
    this.find({ active: true });
});
HotelAccountSchema.methods.compPasswords = utils_1.compPasswords;
HotelAccountSchema.methods.createPasswordResetHash = utils_1.createPasswordResetHash;
HotelAccountSchema.methods.compResetToken = utils_1.compResetToken;
exports.HotelAccountModel = mongoose_1.default.model("HotelAccount", HotelAccountSchema);
