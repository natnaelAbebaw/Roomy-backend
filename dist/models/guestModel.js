"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const utils_1 = require("../services/utils");
const guestSchema = new mongoose_1.default.Schema({
    fullName: { type: String, required: true },
    userName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator_1.default.isEmail, "invalid email"],
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
    nationality: { type: String, required: true },
    nationalID: { type: String, required: true },
    avatarUrl: { type: String },
    passwordChangeAt: {
        type: Date,
        required: true,
        default: Date.now(),
        select: false,
    },
    address: {
        city: { type: String },
        country: { type: String },
    },
    passwordResetToken: String,
    passwordResetTokenExpiresAt: Date,
    active: { type: Boolean, default: true, select: false },
}, { timestamps: true });
guestSchema.pre("save", utils_1.hashPassword);
guestSchema.pre(/^find/, function () {
    this.find({ active: true });
});
guestSchema.methods.compPasswords = utils_1.compPasswords;
guestSchema.methods.createPasswordResetHash = utils_1.createPasswordResetHash;
guestSchema.methods.compResetToken = utils_1.compResetToken;
exports.GuestModel = mongoose_1.default.model("Guest", guestSchema);
