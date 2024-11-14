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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CabinReviewController = void 0;
const cabinReviewModel_1 = require("../models/cabinReviewModel");
const controllerDecorator_1 = require("../decorators/controllerDecorator");
const routeHandlerDecorators_1 = require("../decorators/routeHandlerDecorators");
const authDecorators_1 = require("../decorators/authDecorators");
const Controllers_1 = require("../services/Controllers");
let CabinReviewController = class CabinReviewController extends Controllers_1.Controller {
    getAllCabinReviews() {
        const CabinReviewController = this;
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                req.query.cabin = req.params.cabinsId;
                return CabinReviewController.getAll(cabinReviewModel_1.CabinReviewModel, req, res, next);
            });
        };
    }
    getCabinReview() {
        return this.getOne(cabinReviewModel_1.CabinReviewModel);
    }
    createCabinReview() {
        const CabinReviewController = this;
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!req.body.cabin)
                    req.body.cabin = req.params.cabinsId;
                if (!req.body.guest)
                    req.body.guest = req.user.id;
                return CabinReviewController.create(cabinReviewModel_1.CabinReviewModel, req, res, next);
            });
        };
    }
    deleteCabinReview() {
        return this.delete(cabinReviewModel_1.CabinReviewModel);
    }
    updateCabinReview() {
        return this.update(cabinReviewModel_1.CabinReviewModel);
    }
};
exports.CabinReviewController = CabinReviewController;
__decorate([
    (0, authDecorators_1.protect)(),
    (0, routeHandlerDecorators_1.get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CabinReviewController.prototype, "getAllCabinReviews", null);
__decorate([
    (0, authDecorators_1.protect)(),
    (0, routeHandlerDecorators_1.get)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CabinReviewController.prototype, "getCabinReview", null);
__decorate([
    (0, authDecorators_1.protect)(),
    (0, routeHandlerDecorators_1.post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CabinReviewController.prototype, "createCabinReview", null);
__decorate([
    (0, authDecorators_1.protect)(),
    (0, routeHandlerDecorators_1.del)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CabinReviewController.prototype, "deleteCabinReview", null);
__decorate([
    (0, authDecorators_1.protect)(),
    (0, routeHandlerDecorators_1.patch)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CabinReviewController.prototype, "updateCabinReview", null);
exports.CabinReviewController = CabinReviewController = __decorate([
    (0, controllerDecorator_1.controller)("/CabinReviews")
], CabinReviewController);
