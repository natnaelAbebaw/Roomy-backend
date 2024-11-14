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
exports.HotelReviewController = void 0;
const hotelReviewModel_1 = require("../models/hotelReviewModel");
const controllerDecorator_1 = require("../decorators/controllerDecorator");
const routeHandlerDecorators_1 = require("../decorators/routeHandlerDecorators");
const Controllers_1 = require("../services/Controllers");
const mongodb_1 = require("mongodb");
let HotelReviewController = class HotelReviewController extends Controllers_1.Controller {
    // @protect()
    getAllhotelReviews() {
        const hotelReviewController = this;
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                req.query.hotel = req.params.hotelsId;
                return hotelReviewController.getAll(hotelReviewModel_1.HotelReviewModel, req, res, next);
            });
        };
    }
    // @protect()
    // @protect()
    createhotelReview() {
        const hotelReviewController = this;
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!req.body.hotel)
                    req.body.hotel = req.params.hotelsId;
                if (!req.body.guest)
                    req.body.guest = req.user.id;
                return hotelReviewController.create(hotelReviewModel_1.HotelReviewModel, req, res, next);
            });
        };
    }
    hotelReviewStat() {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = req.params.hotelsId;
                const hotelReview = yield hotelReviewModel_1.HotelReviewModel.aggregate([
                    { $match: { hotel: new mongodb_1.ObjectId(id) } },
                    {
                        $group: {
                            _id: "$hotel",
                            "comfort and cleanliness": {
                                $avg: "$rates.comfort and cleanliness",
                            },
                            "facilities and aminities": {
                                $avg: "$rates.facilities and aminities",
                            },
                            "Overall Experience": { $avg: "$rates.Overall Experience" },
                            "services and staff": { $avg: "$rates.services and staff" },
                            location: { $avg: "$rates.location" },
                            "value for Money": { $avg: "$rates.value for Money" },
                            totalReviews: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            rates: {
                                "comfort and cleanliness": "$comfort and cleanliness",
                                "facilities and aminities": "$facilities and aminities",
                                "Overall Experience": "$Overall Experience",
                                "services and staff": "$services and staff",
                                location: "$location",
                                "value for Money": "$value for Money",
                            },
                            totalReviews: 1,
                        },
                    },
                ]);
                res.status(200).json({ hotelReview: hotelReview[0] });
            });
        };
    }
    hotelReviewRateRangeStat() {
        return __awaiter(this, void 0, void 0, function* () {
            return function (req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    const id = req.params.hotelsId;
                    const RateRanges = yield hotelReviewModel_1.HotelReviewModel.aggregate([
                        {
                            $match: {
                                hotel: new mongodb_1.ObjectId(id),
                            },
                        },
                        {
                            $project: {
                                averageRate: {
                                    $avg: [
                                        "$rates.Overall Experience",
                                        "$rates.comfort and cleanliness",
                                        "$rates.facilities and aminities",
                                        "$rates.Overall Experience",
                                        "$rates.services and staff",
                                        "$rates.location",
                                        "$rates.value for Money",
                                    ],
                                },
                            },
                        },
                        {
                            $bucket: {
                                groupBy: "$averageRate",
                                boundaries: [1, 2, 3, 4, 5],
                                default: "Other",
                                output: {
                                    count: { $sum: 1 },
                                },
                            },
                        },
                    ]);
                    res.status(200).json({ RateRanges });
                });
            };
        });
    }
    gethotelReview() {
        return this.getOne(hotelReviewModel_1.HotelReviewModel);
    }
    // @protect()/
    deletehotelReview() {
        return this.delete(hotelReviewModel_1.HotelReviewModel);
    }
    // @protect()
    updatehotelReview() {
        return this.update(hotelReviewModel_1.HotelReviewModel);
    }
};
exports.HotelReviewController = HotelReviewController;
__decorate([
    (0, routeHandlerDecorators_1.get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelReviewController.prototype, "getAllhotelReviews", null);
__decorate([
    (0, routeHandlerDecorators_1.post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelReviewController.prototype, "createhotelReview", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/hotelReviewStat"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelReviewController.prototype, "hotelReviewStat", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/hotelReviewRateRangeStat"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HotelReviewController.prototype, "hotelReviewRateRangeStat", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelReviewController.prototype, "gethotelReview", null);
__decorate([
    (0, routeHandlerDecorators_1.del)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelReviewController.prototype, "deletehotelReview", null);
__decorate([
    (0, routeHandlerDecorators_1.patch)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelReviewController.prototype, "updatehotelReview", null);
exports.HotelReviewController = HotelReviewController = __decorate([
    (0, controllerDecorator_1.controller)("/hotelReviews")
], HotelReviewController);
