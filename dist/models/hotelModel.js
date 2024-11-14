"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelModel = exports.CabinTypes = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var PopularFacilitiesEnum;
(function (PopularFacilitiesEnum) {
    PopularFacilitiesEnum["wifi"] = "Free Wi-Fi";
    PopularFacilitiesEnum["spa"] = "Spa";
    PopularFacilitiesEnum["gym"] = "Gym";
    PopularFacilitiesEnum["airportRransfer"] = "Airport transfer";
    PopularFacilitiesEnum["freeParking"] = "Free Parking";
    PopularFacilitiesEnum["restaurant"] = "Restaurant";
    PopularFacilitiesEnum["airConditioning"] = "Air Conditioning";
    PopularFacilitiesEnum["swimmingPool"] = "Swimming Pool";
    PopularFacilitiesEnum["bar"] = "Bar/lounge";
    PopularFacilitiesEnum["conferenceRoom"] = "Conference room";
    PopularFacilitiesEnum["businessCenter"] = "Business Center";
    PopularFacilitiesEnum["laundryService"] = "Laundry Service";
    PopularFacilitiesEnum["petsAllowed"] = "Pets allowed";
    PopularFacilitiesEnum["familyRooms"] = "Family rooms";
    PopularFacilitiesEnum["balcony"] = "Balcony";
    PopularFacilitiesEnum["elevator"] = "Elevator";
    PopularFacilitiesEnum["heating"] = "Heating";
})(PopularFacilitiesEnum || (PopularFacilitiesEnum = {}));
var CabinTypes;
(function (CabinTypes) {
    CabinTypes["singleBed"] = "Single Bed";
    CabinTypes["doubleBed"] = "Double Bed";
    CabinTypes["twinBed"] = "Twin Bed";
    CabinTypes["tripleBed"] = "Triple Bed";
    CabinTypes["quadBed"] = "Quad Bed";
    CabinTypes["queenBed"] = "Queen Bed";
    CabinTypes["kingBed"] = "King Bed";
    CabinTypes["suite"] = "Suite";
    CabinTypes["studio"] = "Studio";
})(CabinTypes || (exports.CabinTypes = CabinTypes = {}));
const hotelSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    location: {
        type: {
            city: String,
            state: String,
            country: String,
            zipcode: String,
            continent: String,
            coords: {
                lat: String,
                long: String,
            },
        },
        required: true,
    },
    contacts: {
        email: String,
        phone: String,
        website: String,
    },
    address: { type: String, required: true },
    description: String,
    currency: String,
    starRating: Number,
    checkinTime: String,
    countryISOCode: String,
    checkoutTime: String,
    ratingAverage: { type: Number, default: 0 },
    mainImage: String,
    albumImages: [String],
    facilities: [String],
    cabinTypes: [{ type: String, enum: Object.values(CabinTypes) }],
    cabinCount: { type: Number, default: 0 },
    priceRange: { min: Number, max: Number },
    minBookingLength: { type: Number, default: 1 },
    maxBookingLength: { type: Number, default: 30 },
    popularfacilities: [
        { type: String, enum: Object.values(PopularFacilitiesEnum) },
    ],
    breakFastPrice: { type: Number, default: 0 },
    cancellationPolicy: String,
    additionalPolicies: [String],
    hotelAccount: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "HotelAccount",
        requried: true,
    },
    stripeAccountId: String,
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
hotelSchema.virtual("cabins", {
    ref: "Cabin",
    localField: "_id",
    foreignField: "hotel",
});
exports.HotelModel = mongoose_1.default.model("Hotel", hotelSchema);
