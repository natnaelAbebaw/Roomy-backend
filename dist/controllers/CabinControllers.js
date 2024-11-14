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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CabinController = void 0;
const controllerDecorator_1 = require("../decorators/controllerDecorator");
const routeHandlerDecorators_1 = require("../decorators/routeHandlerDecorators");
const cabinModel_1 = require("../models/cabinModel");
const Controllers_1 = require("../services/Controllers");
const AppError_1 = __importDefault(require("../services/AppError"));
const CabinsReviewController_1 = require("./CabinsReviewController");
const UploadFilesDecorator_1 = require("../decorators/UploadFilesDecorator");
let CabinController = class CabinController extends Controllers_1.Controller {
    getCabinAll() {
        const cabinController = this;
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                req.query.hotel = req.params.hotelsId;
                cabinController.getAll(cabinModel_1.CabinModel, req, res, next);
            });
        };
    }
    // @protect()
    getCabin() {
        return this.getOne(cabinModel_1.CabinModel);
    }
    // @protect(accounts.hotelAccount)
    // @restrictTo(Roles.admin, Roles.manager)
    createCabin() {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                let cabinObject = req.body;
                console.log(cabinObject);
                cabinObject.albumImages = cabinObject.albumImages
                    ? cabinObject.albumImages
                    : (_a = req.files) === null || _a === void 0 ? void 0 : _a.map((file) => `/uploads/${file.filename}`);
                cabinObject = Object.assign(Object.assign({}, cabinObject), { hotel: req.params.hotelsId });
                cabinObject.amenities =
                    cabinObject.amenities && !Array.isArray(cabinObject.amenities)
                        ? cabinObject.amenities.split(",")
                        : cabinObject.amenities;
                cabinObject.bedConfigurations =
                    cabinObject.bedConfigurations &&
                        !Array.isArray(cabinObject.bedConfigurations)
                        ? cabinObject.bedConfigurations.split(",")
                        : cabinObject.bedConfigurations;
                cabinObject.createdAt = undefined;
                cabinObject.updatedAt = undefined;
                const cabin = yield cabinModel_1.CabinModel.find({
                    name: req.body.name,
                    hotel: req.params.hotelId,
                });
                if (cabin && cabin.length > 0) {
                    return next(new AppError_1.default("The cabin name is already used.", 400));
                }
                const resourse = yield cabinModel_1.CabinModel.create(cabinObject);
                res.status(201).json({ status: "success", length: 1, resourse });
            });
        };
    }
    deleteCabin() {
        return this.delete(cabinModel_1.CabinModel);
    }
    updateCabin() {
        // return this.update(CabinModel);
        const cabinController = this;
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                req.query.hotel = req.params.hotelsId;
                req.body.albumImages =
                    ((_a = req.files) === null || _a === void 0 ? void 0 : _a.length) === 0
                        ? undefined
                        : (_b = req.files) === null || _b === void 0 ? void 0 : _b.map((file) => `/uploads/${file.filename}`);
                req.body.amenities =
                    req.body.amenities && !Array.isArray(req.body.amenities)
                        ? req.body.amenities.split(",")
                        : req.body.amenities || [];
                req.body.bedConfigurations =
                    req.body.bedConfigurations && !Array.isArray(req.body.bedConfigurations)
                        ? req.body.bedConfigurations.split(",")
                        : req.body.bedConfigurations || [];
                console.log(req.body);
                cabinController.update(cabinModel_1.CabinModel, req, res, next);
            });
        };
    }
};
exports.CabinController = CabinController;
__decorate([
    (0, routeHandlerDecorators_1.get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CabinController.prototype, "getCabinAll", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CabinController.prototype, "getCabin", null);
__decorate([
    (0, UploadFilesDecorator_1.UploadFiles)("albumImages"),
    (0, routeHandlerDecorators_1.post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CabinController.prototype, "createCabin", null);
__decorate([
    (0, routeHandlerDecorators_1.del)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CabinController.prototype, "deleteCabin", null);
__decorate([
    (0, UploadFilesDecorator_1.UploadFiles)("albumImages"),
    (0, routeHandlerDecorators_1.patch)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CabinController.prototype, "updateCabin", null);
exports.CabinController = CabinController = __decorate([
    (0, controllerDecorator_1.controller)("/cabins", {
        nestedRoutes: [CabinsReviewController_1.CabinReviewController],
    })
], CabinController);
