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
exports.AuthGuestController = void 0;
const controllerDecorator_1 = require("../decorators/controllerDecorator");
const authDecorators_1 = require("../decorators/authDecorators");
const routeHandlerDecorators_1 = require("../decorators/routeHandlerDecorators");
const guestModel_1 = require("../models/guestModel");
const AuthController_1 = require("./AuthController");
let AuthGuestController = class AuthGuestController extends AuthController_1.AuthController {
    signupGuest() {
        return this.signup(guestModel_1.GuestModel);
    }
    loginGuest() {
        return this.login(guestModel_1.GuestModel);
    }
    getAllGuests() {
        return this.getAll(guestModel_1.GuestModel);
    }
    guestForgetPassword() {
        return this.forgetPassword(guestModel_1.GuestModel);
    }
    guestResetPassword() {
        return this.resetPassword(guestModel_1.GuestModel);
    }
    deleteMeForGuest() {
        return this.deleteMe(guestModel_1.GuestModel);
    }
    updateguestInfo() {
        return this.updateUserInfo(guestModel_1.GuestModel);
    }
    updateGuestPassword() {
        return this.updatePassword(guestModel_1.GuestModel);
    }
};
exports.AuthGuestController = AuthGuestController;
__decorate([
    (0, routeHandlerDecorators_1.post)("/signup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthGuestController.prototype, "signupGuest", null);
__decorate([
    (0, routeHandlerDecorators_1.post)("/login"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthGuestController.prototype, "loginGuest", null);
__decorate([
    (0, routeHandlerDecorators_1.get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthGuestController.prototype, "getAllGuests", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/forgetPassword"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthGuestController.prototype, "guestForgetPassword", null);
__decorate([
    (0, routeHandlerDecorators_1.patch)("/:userId/resetPassword/:token"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthGuestController.prototype, "guestResetPassword", null);
__decorate([
    (0, authDecorators_1.protect)(),
    (0, routeHandlerDecorators_1.del)("/deleteMe"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthGuestController.prototype, "deleteMeForGuest", null);
__decorate([
    (0, authDecorators_1.protect)(),
    (0, routeHandlerDecorators_1.patch)("/updateUserInfo"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthGuestController.prototype, "updateguestInfo", null);
__decorate([
    (0, authDecorators_1.protect)(),
    (0, routeHandlerDecorators_1.patch)("/updatePassword"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthGuestController.prototype, "updateGuestPassword", null);
exports.AuthGuestController = AuthGuestController = __decorate([
    (0, controllerDecorator_1.controller)("/guests")
], AuthGuestController);
