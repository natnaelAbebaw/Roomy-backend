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
exports.BookingController = void 0;
const mongodb_1 = require("mongodb");
const controllerDecorator_1 = require("../decorators/controllerDecorator");
const routeHandlerDecorators_1 = require("../decorators/routeHandlerDecorators");
const bookingModel_1 = require("../models/bookingModel");
const Controllers_1 = require("../services/Controllers");
let BookingController = class BookingController extends Controllers_1.Controller {
    getBookingAll() {
        const bookingController = this;
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                req.query.hotel = req.params.hotelsId;
                bookingController.getAll(bookingModel_1.BookingModel, req, res, next);
            });
        };
    }
    GetTodaysActivityBooking() {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const hotelId = req.params.hotelsId;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todaysBookingsArriving = yield bookingModel_1.BookingModel.aggregate([
                    {
                        $match: {
                            hotel: new mongodb_1.ObjectId(hotelId),
                            status: "unconfirmed",
                            checkInDate: {
                                $gte: today,
                                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: "guests",
                            localField: "guest",
                            foreignField: "_id",
                            as: "guest",
                        },
                    },
                    { $unwind: "$guest" },
                    {
                        $addFields: {
                            numNights: {
                                $divide: [
                                    { $subtract: ["$checkOutDate", "$checkInDate"] },
                                    1000 * 60 * 60 * 24,
                                ],
                            },
                        },
                    },
                ]);
                const todaysBookingsDeparting = yield bookingModel_1.BookingModel.aggregate([
                    {
                        $match: {
                            hotel: new mongodb_1.ObjectId(hotelId),
                            status: "checkedin",
                            checkOutDate: {
                                $gte: today,
                                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: "guests",
                            localField: "guest",
                            foreignField: "_id",
                            as: "guest",
                        },
                    },
                    { $unwind: "$guest" },
                    {
                        $addFields: {
                            numNights: {
                                $divide: [
                                    { $subtract: ["$checkOutDate", "$checkInDate"] },
                                    1000 * 60 * 60 * 24,
                                ],
                            },
                        },
                    },
                ]);
                const todaysBookings = [
                    ...todaysBookingsArriving,
                    ...todaysBookingsDeparting,
                ];
                res.status(200).json({
                    status: "success",
                    length: todaysBookings.length,
                    todaysBookings,
                });
            });
        };
    }
    getBooking() {
        return this.getOne(bookingModel_1.BookingModel);
    }
    checkin() {
        const CabinController = this;
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                req.query.hotel = req.params.hotelsId;
                CabinController.getAll(bookingModel_1.BookingModel, req, res, next);
            });
        };
    }
    createBooking() {
        const bookingController = this;
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                req.body.hotel = req.params.hotelsId;
                bookingController.create(bookingModel_1.BookingModel, req, res, next);
            });
        };
    }
    deleteBooking() {
        return this.delete(bookingModel_1.BookingModel);
    }
    updateBooking() {
        return this.update(bookingModel_1.BookingModel);
    }
    searchBookingByGuestName() {
        const bookingController = this;
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const q = req.params.q;
                const matchConditions = {};
                const sortBy = (_a = req.query.sort) === null || _a === void 0 ? void 0 : _a.split(",").join(" ");
                if (req.query.status) {
                    matchConditions.status = req.query.status;
                }
                const query = bookingModel_1.BookingModel.aggregate([
                    {
                        $lookup: {
                            from: "guests",
                            localField: "guest",
                            foreignField: "_id",
                            as: "guest",
                        },
                    },
                    {
                        $lookup: {
                            from: "cabins",
                            localField: "cabin",
                            foreignField: "_id",
                            as: "cabin",
                        },
                    },
                    {
                        $unwind: "$guest",
                    },
                    {
                        $unwind: "$cabin",
                    },
                    {
                        $match: {
                            "guest.fullName": { $regex: q, $options: "i" },
                        },
                    },
                    {
                        $addFields: {
                            numNights: {
                                $ceil: [
                                    {
                                        $divide: [
                                            { $subtract: ["$checkOutDate", "$checkInDate"] }, // Subtract the dates (in milliseconds)
                                            1000 * 60 * 60 * 24, // Convert milliseconds to days
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        $match: Object.assign({}, matchConditions),
                    },
                    {
                        $project: {
                            _id: 1,
                            checkInDate: 1,
                            checkOutDate: 1,
                            cabinPrice: 1,
                            extrasPrice: 1,
                            totalPrice: 1,
                            status: 1,
                            hasBreakfast: 1,
                            paymentStatus: 1,
                            numNights: 1,
                            createdAt: 1,
                            "cabin.name": 1,
                            "guest.fullName": 1,
                            "guest.email": 1,
                            "guest.nationalID": 1,
                            total_count: 1,
                        },
                    },
                ]);
                const queryCount = bookingModel_1.BookingModel.aggregate([
                    {
                        $lookup: {
                            from: "guests",
                            localField: "guest",
                            foreignField: "_id",
                            as: "guest",
                        },
                    },
                    {
                        $unwind: "$guest",
                    },
                    {
                        $match: {
                            "guest.fullName": { $regex: q, $options: "i" },
                        },
                    },
                    {
                        $match: Object.assign({}, matchConditions),
                    },
                    {
                        $count: "total_count",
                    },
                ]);
                const totalItems = yield queryCount;
                if (sortBy) {
                    query.sort(sortBy);
                }
                const page = req.query.page ? +req.query.page : 1;
                const limit = req.query.limit ? +req.query.limit : 3;
                const skip = (page - 1) * limit;
                query.skip(skip).limit(limit);
                const resourses = yield query;
                res.status(200).json({
                    status: "success",
                    length: resourses.length,
                    totalItems: ((_b = totalItems[0]) === null || _b === void 0 ? void 0 : _b.total_count) || 0,
                    resourses,
                });
            });
        };
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, routeHandlerDecorators_1.get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getBookingAll", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/todaysActivityBookings"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "GetTodaysActivityBooking", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getBooking", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/checkin"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "checkin", null);
__decorate([
    (0, routeHandlerDecorators_1.post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "createBooking", null);
__decorate([
    (0, routeHandlerDecorators_1.del)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "deleteBooking", null);
__decorate([
    (0, routeHandlerDecorators_1.patch)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "updateBooking", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/q/:q"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "searchBookingByGuestName", null);
exports.BookingController = BookingController = __decorate([
    (0, controllerDecorator_1.controller)("/bookings")
], BookingController);
