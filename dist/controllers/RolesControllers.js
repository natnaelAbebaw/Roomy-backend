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
exports.RolesController = void 0;
const rolesModel_1 = require("../models/rolesModel");
const controllerDecorator_1 = require("../decorators/controllerDecorator");
const routeHandlerDecorators_1 = require("../decorators/routeHandlerDecorators");
const Controllers_1 = require("../services/Controllers");
let RolesController = class RolesController extends Controllers_1.Controller {
    getAllRoles() {
        return this.getAll(rolesModel_1.RolesModel);
    }
    getRole() {
        return this.getOne(rolesModel_1.RolesModel);
    }
    createRole() {
        return this.create(rolesModel_1.RolesModel);
    }
    deleteRole() {
        return this.delete(rolesModel_1.RolesModel);
    }
    updateRole() {
        return this.update(rolesModel_1.RolesModel);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, routeHandlerDecorators_1.get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "getAllRoles", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "getRole", null);
__decorate([
    (0, routeHandlerDecorators_1.post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "createRole", null);
__decorate([
    (0, routeHandlerDecorators_1.del)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "deleteRole", null);
__decorate([
    (0, routeHandlerDecorators_1.patch)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "updateRole", null);
exports.RolesController = RolesController = __decorate([
    (0, controllerDecorator_1.controller)("/roles")
], RolesController);
