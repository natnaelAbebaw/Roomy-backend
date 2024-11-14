"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CabinReviewModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cabinReviewSchema = new mongoose_1.default.Schema({
    rates: {
        "Scenic Beauty": { type: Number, default: 1, min: 1, max: 5 },
        "Privacy and Seclusion": { type: Number, default: 1, min: 1, max: 5 },
        "Comfort and Coziness": { type: Number, default: 1, min: 1, max: 5 },
        "Outdoor Amenities": { type: Number, default: 1, min: 1, max: 5 },
        "Unique Features": { type: Number, default: 1, min: 1, max: 5 },
        "Overall Experience": { type: Number, default: 1, min: 1, max: 5 },
    },
    review: { type: String, index: true },
    guest: { type: mongoose_1.default.Schema.ObjectId, ref: "Guest", required: true },
    cabin: { type: mongoose_1.default.Schema.ObjectId, ref: "Cabin", required: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
cabinReviewSchema.index({ review: "text" });
cabinReviewSchema.virtual("averageRate").get(function () {
    const rates = Object.values(this.rates);
    const averageRate = rates.reduce((acc, rate) => acc + rate, 0) / rates.length;
    return averageRate;
});
exports.CabinReviewModel = mongoose_1.default.model("CabinReview", cabinReviewSchema);
