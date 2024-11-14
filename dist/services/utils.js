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
exports.compResetToken = exports.createPasswordResetHash = exports.hashPassword = exports.compPasswords = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
function compPasswords(candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(candidatePassword, userPassword);
    });
}
exports.compPasswords = compPasswords;
function hashPassword(next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            return next();
        }
        this.confirmPassword = undefined;
        this.password = yield bcrypt_1.default.hash(this.password, 12);
        next();
    });
}
exports.hashPassword = hashPassword;
function createPasswordResetHash() {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    const resetTokenHash = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    return { resetToken, resetTokenHash };
}
exports.createPasswordResetHash = createPasswordResetHash;
function compResetToken(candidateRestToken, restTokenHash) {
    const candidateRestTokenHash = crypto_1.default
        .createHash("sha256")
        .update(candidateRestToken)
        .digest("hex");
    return restTokenHash === candidateRestTokenHash;
}
exports.compResetToken = compResetToken;
