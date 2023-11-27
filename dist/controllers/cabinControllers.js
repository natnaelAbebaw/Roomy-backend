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
const controller_1 = require("../decorators/controller");
const routeHandles_1 = require("../decorators/routeHandles");
const cabinModel_1 = require("../models/cabinModel");
let CabinController = class CabinController {
    getCabinAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cabins = yield cabinModel_1.CabinModel.find({});
            res.status(200).json({ status: "success", length: cabins.length, cabins });
        });
    }
    getCabin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const cabin = yield cabinModel_1.CabinModel.findById({ id });
            if (cabin)
                res.status(200).json({ status: "success", length: 1, cabin });
            else
                res.status(404).json({ status: "fail", message: "cabin not found" });
        });
    }
    addCabin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cabin = yield cabinModel_1.CabinModel.create(req.body);
            if (cabin)
                res.status(201).json({ status: "success", length: 1, cabin });
        });
    }
    deleteCabin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cabin = yield cabinModel_1.CabinModel.findByIdAndDelete(req.params.id);
            if (cabin)
                res.status(204).json({ status: "success" });
            else
                res.status(404).json({ status: "fail", message: "cabin not found" });
        });
    }
    updateCabin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cabin = yield cabinModel_1.CabinModel.findByIdAndUpdate(req.params.id);
            if (cabin)
                res.status(200).json({ status: "success", length: 1, cabin });
            else
                res.status(404).json({ status: "fail", message: "cabin not found" });
        });
    }
};
__decorate([
    (0, routeHandles_1.get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CabinController.prototype, "getCabinAll", null);
__decorate([
    (0, routeHandles_1.get)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CabinController.prototype, "getCabin", null);
__decorate([
    (0, routeHandles_1.post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CabinController.prototype, "addCabin", null);
__decorate([
    (0, routeHandles_1.del)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CabinController.prototype, "deleteCabin", null);
__decorate([
    (0, routeHandles_1.patch)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CabinController.prototype, "updateCabin", null);
CabinController = __decorate([
    (0, controller_1.controller)("/cabins")
], CabinController);
