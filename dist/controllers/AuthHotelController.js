"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthHotelController = void 0;
const controllerDecorator_1 = require("../decorators/controllerDecorator");
const routeHandlerDecorators_1 = require("../decorators/routeHandlerDecorators");
const authDecorators_1 = require("../decorators/authDecorators");
const hotelAccount_1 = require("../models/hotelAccount");
const AuthController_1 = require("./AuthController");
let AuthHotelController = class AuthHotelController extends AuthController_1.AuthController {
    signupHotelAccount() {
        return this.signup(hotelAccount_1.HotelAccountModel);
    }
    loginHotelAccount() {
        return this.login(hotelAccount_1.HotelAccountModel);
    }
    getAllHotelAccounts() {
        return this.getAll(hotelAccount_1.HotelAccountModel);
    }
    hotelAccountForgetPassword() {
        return this.forgetPassword(hotelAccount_1.HotelAccountModel);
    }
    hotelAccountResetPassword() {
        return this.resetPassword(hotelAccount_1.HotelAccountModel);
    }
    deleteMeForHotelAccount() {
        return this.deleteMe(hotelAccount_1.HotelAccountModel);
    }
    updateHotelAccountInfo() {
        return this.updateUserInfo(hotelAccount_1.HotelAccountModel);
    }
    updateHotelAccountPassword() {
        return this.updatePassword(hotelAccount_1.HotelAccountModel);
    }
};
exports.AuthHotelController = AuthHotelController;
__decorate([
    (0, routeHandlerDecorators_1.post)("/signup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthHotelController.prototype, "signupHotelAccount", null);
__decorate([
    (0, routeHandlerDecorators_1.post)("/login"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthHotelController.prototype, "loginHotelAccount", null);
__decorate([
    (0, routeHandlerDecorators_1.get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthHotelController.prototype, "getAllHotelAccounts", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/forgetPassword"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthHotelController.prototype, "hotelAccountForgetPassword", null);
__decorate([
    (0, routeHandlerDecorators_1.patch)("/:userId/resetPassword/:token"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthHotelController.prototype, "hotelAccountResetPassword", null);
__decorate([
    (0, authDecorators_1.protect)(),
    (0, routeHandlerDecorators_1.del)("/deleteMe"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthHotelController.prototype, "deleteMeForHotelAccount", null);
__decorate([
    (0, authDecorators_1.protect)(),
    (0, routeHandlerDecorators_1.patch)("/updateUserInfo"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthHotelController.prototype, "updateHotelAccountInfo", null);
__decorate([
    (0, authDecorators_1.protect)(),
    (0, routeHandlerDecorators_1.patch)("/updatePassword"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthHotelController.prototype, "updateHotelAccountPassword", null);
exports.AuthHotelController = AuthHotelController = __decorate([
    (0, controllerDecorator_1.controller)("/hotelAccounts")
], AuthHotelController);
