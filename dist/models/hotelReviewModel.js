"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelReviewModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const hotelReviewSchema = new mongoose_1.default.Schema({
    rates: {
        "comfort and cleanliness": { type: Number, default: 1 },
        "facilities and aminities": { type: Number, default: 1 },
        "Overall Experience": { type: Number, default: 1 },
        "services and staff": { type: Number, default: 1 },
        location: { type: Number, default: 1 },
        "value for Money": { type: Number, default: 1 },
    },
    avarageRating: { type: Number, default: 1 },
    review: { type: String, index: true },
    hotel: { type: mongoose_1.default.Schema.ObjectId, ref: "Hotel", required: true },
    guest: { type: mongoose_1.default.Schema.ObjectId, ref: "Guest", required: true },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
hotelReviewSchema.index({ review: "text" });
hotelReviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "guest",
        select: "fullName userName email avatarUrl address",
    });
    next();
});
hotelReviewSchema.pre("save", function (next) {
    const rates = Object.values(this.rates);
    const averageRate = rates.reduce((acc, rate) => acc + rate, 0) / rates.length;
    this.avarageRating = averageRate;
    next();
});
exports.HotelReviewModel = mongoose_1.default.model("HotelReview", hotelReviewSchema);
