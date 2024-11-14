"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CabinModel = exports.BedConfigurations = exports.amenities = exports.CabinTypes = exports.ViewTypeEnum = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ViewTypeEnum;
(function (ViewTypeEnum) {
    ViewTypeEnum["NONE"] = "None";
    ViewTypeEnum["OCEAN"] = "Ocean View";
    ViewTypeEnum["MOUNTAIN"] = "Mountain View";
    ViewTypeEnum["CITY"] = "City View";
    ViewTypeEnum["GARDEN"] = "Garden View";
    ViewTypeEnum["LAKE"] = "Lake View";
    ViewTypeEnum["POOL"] = "Pool View";
    ViewTypeEnum["COURTYARD"] = "Courtyard View";
    ViewTypeEnum["WILDLIFE"] = "Wildlife View";
    ViewTypeEnum["PARTIAL"] = "Partial View";
    ViewTypeEnum["PARK"] = "Park View";
    ViewTypeEnum["FOREST"] = "Forest View";
})(ViewTypeEnum || (exports.ViewTypeEnum = ViewTypeEnum = {}));
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
var amenities;
(function (amenities) {
    amenities["Bed"] = "Bed";
    amenities["WiFi"] = "WiFi";
    amenities["AirConditioning"] = "Air Conditioning";
    amenities["Television"] = "Television";
    amenities["MiniFridge"] = "Mini Fridge";
    amenities["CoffeeTeaMaker"] = "Coffee/Tea Maker";
    amenities["RoomService"] = "Room Service";
    amenities["DeskAndChair"] = "Desk and Chair";
    amenities["Telephone"] = "Telephone";
    amenities["Wardrobe"] = "Wardrobe/Closet";
    amenities["Safe"] = "Safe";
    amenities["IronAndIroningBoard"] = "Iron and Ironing Board";
    amenities["Hairdryer"] = "Hairdryer";
    amenities["PrivateBathroom"] = "Private Bathroom";
    amenities["Toiletries"] = "Toiletries";
    amenities["TowelsAndBathrobe"] = "Towels and Bathrobe";
    amenities["Slippers"] = "Slippers";
    amenities["BlackoutCurtains"] = "Blackout Curtains";
    amenities["SoundproofWindows"] = "Soundproof Windows";
    amenities["Balcony"] = "Balcony or Window View";
    amenities["LaundryService"] = "Laundry Service";
    amenities["DailyHousekeeping"] = "Daily Housekeeping";
    amenities["AlarmClock"] = "Alarm Clock";
    amenities["USBChargingPorts"] = "USB Charging Ports";
})(amenities || (exports.amenities = amenities = {}));
var BedConfigurations;
(function (BedConfigurations) {
    BedConfigurations["KingBed"] = "King Bed";
    BedConfigurations["QueenBed"] = "Queen Bed";
    BedConfigurations["DoubleBed"] = "Double Bed";
    BedConfigurations["TwinBeds"] = "Twin Beds";
    BedConfigurations["BunkBeds"] = "Bunk Beds";
    BedConfigurations["Single"] = "Single Bed";
})(BedConfigurations || (exports.BedConfigurations = BedConfigurations = {}));
const cabinSchema = new mongoose_1.Schema({
    name: {
        type: String,
        index: true,
        required: [true, "This field is required"],
    },
    cabinType: {
        type: String,
        enum: Object.values(CabinTypes),
        required: [true, "This field is required"],
    },
    albumImages: { type: [String], default: [] },
    mainImage: {
        type: String,
    },
    floor: { type: Number, required: [true, "This field is required"] },
    maxCapacity: {
        type: Number,
        required: [true, "This field is required"],
        min: [1, "Number guests must be at least 1"],
        default: 1,
    },
    regularPrice: {
        type: Number,
        required: [true, "This field is required"],
    },
    discount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.regularPrice;
            },
            message: "discount must be less than reqular price",
        },
    },
    amenities: {
        type: [
            {
                type: String,
                enum: Object.values(amenities),
            },
        ],
        default: [],
    },
    bedConfigurations: {
        type: [
            {
                type: String,
                enum: Object.values(BedConfigurations),
            },
        ],
        default: [],
    },
    numBeds: {
        type: Number,
        default: 1,
        required: [true, "This field is required"],
    },
    description: {
        type: String,
    },
    viewType: {
        type: String,
        enum: ViewTypeEnum,
        default: ViewTypeEnum.NONE,
    },
    hotel: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
}, { timestamps: true });
cabinSchema.index({ name: "text" });
exports.CabinModel = mongoose_1.default.model("Cabin", cabinSchema);
