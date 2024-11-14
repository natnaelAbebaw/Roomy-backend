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
exports.HotelsController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const controllerDecorator_1 = require("../decorators/controllerDecorator");
const routeHandlerDecorators_1 = require("../decorators/routeHandlerDecorators");
const authDecorators_1 = require("../decorators/authDecorators");
const hotelModel_1 = require("../models/hotelModel");
const Controllers_1 = require("../services/Controllers");
const bookingModel_1 = require("../models/bookingModel");
const cabinModel_1 = require("../models/cabinModel");
const AppError_1 = __importDefault(require("../services/AppError"));
const rolesModel_1 = require("../models/rolesModel");
const accounts_1 = require("../decorators/accounts");
const ApiFeatures_1 = require("../services/ApiFeatures");
const mongodb_1 = require("mongodb");
const CabinControllers_1 = require("./CabinControllers");
const HotelsReviewController_1 = require("./HotelsReviewController");
const BookingController_1 = require("./BookingController");
let HotelsController = class HotelsController extends Controllers_1.Controller {
    getHotelAll() {
        return this.getAll(hotelModel_1.HotelModel);
    }
    searchHotels(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { city, country, state, checkinDate, checkoutDate, numGuests } = req.query;
            let bookings = [];
            let filterQuery = {};
            if (checkinDate && checkoutDate && numGuests) {
                bookings = yield bookingModel_1.BookingModel.find({
                    $or: [
                        {
                            checkInDate: { $lte: new Date(checkinDate) },
                            checkOutDate: { $gte: new Date(checkinDate) },
                        },
                        {
                            checkInDate: { $lte: new Date(checkoutDate) },
                            checkOutDate: { $gte: new Date(checkoutDate) },
                        },
                    ],
                });
                const reserverdCabinId = bookings.map((book) => book.cabin);
                let availableCabins = [];
                availableCabins =
                    (yield cabinModel_1.CabinModel.find({
                        _id: { $nin: reserverdCabinId },
                        maxCapacity: { $gte: numGuests },
                    })) || [];
                const availableHotelId = availableCabins.map((cabin) => cabin.hotel);
                filterQuery = { _id: { in: availableHotelId } };
            }
            if (city)
                filterQuery["location.city"] = city;
            if (state)
                filterQuery["location.state"] = state;
            if (country)
                filterQuery["location.country"] = country;
            const searchQueryString = [
                "city",
                "state",
                "country",
                "numGuests",
                "checkinDate",
                "checkoutDate",
            ];
            for (const key in req.query) {
                if (!searchQueryString.includes(key) &&
                    req.query[key] &&
                    req.query[key] !== "") {
                    filterQuery[key] = req.query[key];
                }
            }
            return filterQuery;
        });
    }
    Hotels() {
        const hotelController = this;
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const filterQuery = yield hotelController.searchHotels(req);
                for (const key in filterQuery) {
                    if (filterQuery[key].all && !Array.isArray(filterQuery[key].all)) {
                        filterQuery[key] = { all: filterQuery[key].all.split(",") };
                    }
                }
                console.log(filterQuery);
                const apiFeature = new ApiFeatures_1.ApiFeatures(hotelModel_1.HotelModel, filterQuery);
                const err = yield apiFeature
                    .applyFilter()
                    .applySort()
                    .applyFields()
                    .applyPagnation()
                    .catch((err) => err);
                if (err)
                    return next(err);
                const hotels = yield apiFeature.query;
                res
                    .status(200)
                    .json({ status: "success", length: hotels.length, hotels });
            });
        };
    }
    getHotelStats() {
        const hotelController = this;
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                let filterQuery = yield hotelController.searchHotels(req);
                filterQuery = JSON.parse(JSON.stringify(filterQuery).replace(/\b(gte|gt|lte|le|in|all)\b/g, (match) => `$${match}`));
                for (const key in filterQuery) {
                    if (filterQuery[key].$all && !Array.isArray(filterQuery[key].$all)) {
                        filterQuery[key].$all = filterQuery[key].$all.split(",");
                    }
                    if (filterQuery[key].$in && !Array.isArray(filterQuery[key].$in)) {
                        filterQuery[key].$in = [filterQuery[key].$in];
                    }
                    if (filterQuery[key].$lte ||
                        filterQuery[key].$gte ||
                        filterQuery[key].$lt ||
                        filterQuery[key].$gt ||
                        filterQuery[key].$eq) {
                        for (const k in filterQuery[key]) {
                            filterQuery[key][k] = Number(filterQuery[key][k]);
                        }
                    }
                }
                if (filterQuery._id && filterQuery._id.$in) {
                    filterQuery._id.$in = filterQuery._id.$in.map((id) => new mongodb_1.ObjectId(id));
                }
                console.log(filterQuery);
                const hotelStats = yield hotelModel_1.HotelModel.aggregate([
                    {
                        $match: filterQuery,
                    },
                    {
                        $count: "totalHotels",
                    },
                ]);
                res
                    .status(200)
                    .json({ status: "success", length: 1, hotelStats: hotelStats[0] });
            });
        };
    }
    getHoteLPriceRangeStats() {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const { cabinTypes } = req.query;
                const minmaxPrice = yield hotelModel_1.HotelModel.aggregate([
                    {
                        $group: {
                            _id: null,
                            minPrice: { $min: "$priceRange.min" },
                            maxPrice: { $max: "$priceRange.max" },
                        },
                    },
                ]);
                function generateBoundaries(min, max, gap) {
                    const boundaries = [min];
                    let current = min;
                    while (current < max) {
                        current += gap;
                        boundaries.push(current);
                    }
                    if (boundaries[boundaries.length - 1] <= max) {
                        boundaries.push(max + gap);
                    }
                    return boundaries;
                }
                const boundaries = generateBoundaries(minmaxPrice[0].minPrice, minmaxPrice[0].maxPrice, 20);
                const priceRanges = yield hotelModel_1.HotelModel.aggregate([
                    {
                        $match: {
                            cabinTypes: {
                                $in: cabinTypes ? [cabinTypes] : Object.values(hotelModel_1.CabinTypes),
                            },
                        },
                    },
                    {
                        $project: {
                            averagePrice: {
                                $avg: ["$priceRange.min", "$priceRange.max"],
                            },
                        },
                    },
                    {
                        $bucket: {
                            groupBy: "$averagePrice",
                            boundaries: boundaries,
                            default: "Other",
                            output: {
                                count: { $sum: 1 },
                            },
                        },
                    },
                ]);
                for (const i of boundaries) {
                    if (!priceRanges.find((range) => range._id === i)) {
                        priceRanges.push({ _id: i, count: 0 });
                    }
                }
                res.status(200).json({
                    status: "success",
                    length: priceRanges.length,
                    priceStats: {
                        priceRanges: priceRanges.sort((a, b) => a._id - b._id),
                        maxCount: Math.max(...priceRanges.map((range) => range.count)),
                        maxPrice: minmaxPrice[0].maxPrice,
                        minPrice: minmaxPrice[0].minPrice,
                    },
                });
            });
        };
    }
    getHotel() {
        console.log("hotel id");
        return this.getOne(hotelModel_1.HotelModel);
    }
    getCabinStats() {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = req.params.id;
                const { checkinDate, checkoutDate, numGuests } = req.query;
                // find  cabins not reserved in the hotel with the given date
                let reserverdCabinId = [];
                if (checkinDate && checkoutDate) {
                    const bookings = yield bookingModel_1.BookingModel.find({
                        hotel: id,
                        $or: [
                            {
                                checkInDate: { $lte: new Date(checkinDate) },
                                checkOutDate: { $gte: new Date(checkinDate) },
                            },
                            {
                                checkInDate: { $lte: new Date(checkoutDate) },
                                checkOutDate: { $gte: new Date(checkoutDate) },
                            },
                        ],
                    });
                    reserverdCabinId = bookings.map((book) => book.cabin);
                    console.log(reserverdCabinId);
                }
                // 2. process the cabins data in the hotel and return the stats
                const cabins = yield cabinModel_1.CabinModel.aggregate([
                    {
                        $match: {
                            hotel: new mongodb_1.ObjectId(id),
                            maxCapacity: { $gte: Number(numGuests || 1) },
                        },
                    },
                    {
                        $group: {
                            _id: "$cabinType",
                            numCabins: { $sum: 1 },
                            numCabinsAvailable: {
                                $sum: { $cond: [{ $in: ["$_id", reserverdCabinId] }, 0, 1] },
                            },
                            maxCapacity: { $avg: "$maxCapacity" },
                            images: { $first: "$albumImages" },
                            regularPrice: { $avg: "$regularPrice" },
                            discount: { $avg: "$discount" },
                            amenities: { $first: "$amenities" },
                            availableCabins: {
                                $push: {
                                    $cond: [{ $in: ["$_id", reserverdCabinId] }, null, "$_id"],
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            cabinType: "$_id",
                            amenities: 1,
                            numCabins: 1,
                            numCabinsAvailable: 1,
                            maxCapacity: 1,
                            images: 1,
                            regularPrice: 1,
                            discount: 1,
                            availableCabins: {
                                $filter: {
                                    input: "$availableCabins",
                                    as: "availableCabin",
                                    cond: { $ne: ["$$availableCabin", null] },
                                },
                            },
                        },
                    },
                ]);
                res.status(200).json({ cabins });
            });
        };
    }
    createHotel() {
        return function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const resourse = yield hotelModel_1.HotelModel.create(Object.assign(Object.assign({}, req.body), { hotelAccount: req.user._id }));
                const stripeApi = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
                yield rolesModel_1.RolesModel.create({
                    role: rolesModel_1.Roles.admin,
                    hotel: resourse._id,
                    hotelAccount: resourse.hotelAccount,
                });
                const account = yield stripeApi.accounts.create({
                    type: "express",
                    capabilities: {
                        card_payments: {
                            requested: true,
                        },
                        transfers: {
                            requested: true,
                        },
                    },
                });
                resourse.stripeAccountId = account.id;
                yield resourse.save();
                res.status(201).json({ status: "success", length: 1, resourse, account });
            });
        };
    }
    getStripeLink() {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const hotel = yield hotelModel_1.HotelModel.findById(req.params.id);
                if (!hotel)
                    return next(new AppError_1.default("Hotel not found", 404));
                const stripeApi = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
                const accountLink = yield stripeApi.accountLinks.create({
                    account: hotel.stripeAccountId,
                    refresh_url: "http://localhost:8000/hotels",
                    return_url: "http://localhost:8000/hotels",
                    type: "account_onboarding",
                });
                res.status(200).json({ status: "success", accountLink });
            });
        };
    }
    CreateStripeAccountForHotel() {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = req.params.id;
                const hotel = yield hotelModel_1.HotelModel.findById(id);
                if (!hotel)
                    return next(new AppError_1.default("Hotel not found", 404));
                const stripeApi = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
                const account = yield stripeApi.accounts.create({
                    type: "express",
                    // email: hotel.contacts.email,
                    capabilities: {
                        card_payments: {
                            requested: true,
                        },
                        transfers: {
                            requested: true,
                        },
                    },
                });
                const bankAccountToken = yield stripeApi.tokens.create({
                    bank_account: {
                        country: "US",
                        currency: "usd",
                        routing_number: "110000000", // Stripe test routing number
                        account_number: "000123456789", // Stripe test account number
                        account_holder_name: "Test Account",
                        account_holder_type: "individual",
                    },
                });
                yield stripeApi.accounts.createExternalAccount(account.id, {
                    external_account: bankAccountToken.id,
                });
                hotel.stripeAccountId = account.id;
                yield hotel.save();
                res.status(201).json({ status: "success", length: 1, hotel, account });
            });
        };
    }
    CreatePaymentIntent() {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const { bookingId } = req.params;
                const hotelId = req.params.id;
                const hotel = yield hotelModel_1.HotelModel.findById(hotelId);
                if (!hotel)
                    return next(new AppError_1.default("Hotel not found", 404));
                const booking = yield bookingModel_1.BookingModel.findById(bookingId);
                const guestId = booking === null || booking === void 0 ? void 0 : booking.guest._id;
                if (!booking)
                    return next(new AppError_1.default("Booking not found", 404));
                const stripeApi = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
                const paymentIntent = yield stripeApi.paymentIntents.create({
                    amount: Math.round((booking === null || booking === void 0 ? void 0 : booking.totalPrice) * 100 * 0.9),
                    currency: "usd",
                    payment_method_types: ["card"],
                    application_fee_amount: Math.round((booking === null || booking === void 0 ? void 0 : booking.totalPrice) * 0.1 * 100),
                    transfer_data: {
                        destination: hotel.stripeAccountId,
                    },
                    metadata: {
                        bookingId: booking.id,
                        hotelId: hotel.id,
                        guestId,
                    },
                });
                res.status(201).json({
                    status: "success",
                    length: 1,
                    resource: { clientSecret: paymentIntent.client_secret },
                });
            });
        };
    }
    // @post("/webhook")
    // StripeWebhook() {
    //   return async function (req: Request, res: Response, next: NextFunction) {
    //     const sig = req.headers["stripe-signature"];
    //     let event;
    //     try {
    //       // Verify the webhook signature
    //       // event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
    //     } catch (err) {
    //       console.log("Webhook signature verification failed", err);
    //       return res.status(400).send(`Webhook Error: ${err.message}`);
    //     }
    //     // Handle the event based on the type
    //     switch (event.type) {
    //       case "payment_intent.succeeded":
    //         const paymentIntent = event.data.object; // Contains a PaymentIntent object
    //         console.log("PaymentIntent was successful:", paymentIntent);
    //         // Update payment status in your database, send confirmation to the user, etc.
    //         break;
    //       case "payment_intent.payment_failed":
    //         const paymentFailed = event.data.object;
    //         console.log("Payment failed:", paymentFailed);
    //         // Update payment status in your database or notify the user
    //         break;
    //       // Handle other event types as necessary
    //       default:
    //         console.log(`Unhandled event type: ${event.type}`);
    //     }
    //     // Acknowledge receipt of the event
    //     res.status(200).send("Event received");
    //   };
    // }
    deleteHotel() {
        return this.delete(hotelModel_1.HotelModel);
    }
    updateHotel() {
        return this.update(hotelModel_1.HotelModel);
    }
};
exports.HotelsController = HotelsController;
__decorate([
    (0, routeHandlerDecorators_1.get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "getHotelAll", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/q"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "Hotels", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/hotelStats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "getHotelStats", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/getHotelPriceRangeStats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "getHoteLPriceRangeStats", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "getHotel", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/cabinStats/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "getCabinStats", null);
__decorate([
    (0, authDecorators_1.protect)(accounts_1.accounts.hotelAccount),
    (0, routeHandlerDecorators_1.post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "createHotel", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/stripeLink/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "getStripeLink", null);
__decorate([
    (0, routeHandlerDecorators_1.get)("/:id/createStripeAccount"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "CreateStripeAccountForHotel", null);
__decorate([
    (0, routeHandlerDecorators_1.post)("/:id/createPaymentIntent/:bookingId"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "CreatePaymentIntent", null);
__decorate([
    (0, routeHandlerDecorators_1.del)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "deleteHotel", null);
__decorate([
    (0, routeHandlerDecorators_1.patch)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "updateHotel", null);
exports.HotelsController = HotelsController = __decorate([
    (0, controllerDecorator_1.controller)("/hotels", {
        nestedRoutes: [CabinControllers_1.CabinController, HotelsReviewController_1.HotelReviewController, BookingController_1.BookingController],
    })
], HotelsController);
