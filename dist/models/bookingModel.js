"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const date_fns_1 = require("date-fns");
const bookingSchema = new mongoose_1.default.Schema({
    guest: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Guest",
        required: true,
    },
    cabin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Cabin",
        required: true,
    },
    hotel: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    cabinPrice: {
        type: Number,
        required: true,
    },
    extrasPrice: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["checkedin", "checkedout", "unconfirmed"],
    },
    hasBreakfast: {
        type: Boolean,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
bookingSchema.virtual("numNights").get(function () {
    return (0, date_fns_1.differenceInDays)(this.checkOutDate, this.checkInDate);
});
bookingSchema.pre(/^find/, function () {
    this.populate({
        path: "cabin",
        select: "name",
    }).populate({
        path: "guest",
        select: "fullName email nationalID nationality",
    });
});
exports.BookingModel = mongoose_1.default.model("Booking", bookingSchema);
