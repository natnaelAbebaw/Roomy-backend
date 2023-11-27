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
exports.CabinModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ViewTypeEnum;
(function (ViewTypeEnum) {
    ViewTypeEnum["NONE"] = "none";
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
})(ViewTypeEnum || (ViewTypeEnum = {}));
var CabinTypes;
(function (CabinTypes) {
    CabinTypes["DeluxeSuite"] = "Deluxe Suite";
    CabinTypes["FamilyCabin"] = "Family Cabin";
    CabinTypes["HoneymoonSuite"] = "Honeymoon Suite";
    CabinTypes["LogCabin"] = "Log Cabin";
    CabinTypes["CityLoft"] = "City Loft";
    CabinTypes["SpaRetreat"] = "Spa Retreat";
    CabinTypes["LuxuryPenthouse"] = "Luxury Penthouse";
    CabinTypes["BeachfrontCottage"] = "Beachfront Cottage";
    CabinTypes["MountainLodge"] = "Mountain Lodge";
    CabinTypes["GreenSuite"] = "Green Suite";
    CabinTypes["Standard"] = "Standard";
    CabinTypes["Deluxe"] = "deluxe";
    CabinTypes["Suite"] = "suite";
})(CabinTypes || (CabinTypes = {}));
var BedConfigurations;
(function (BedConfigurations) {
    BedConfigurations["KingBed"] = "King Bed";
    BedConfigurations["QueenBed"] = "Queen Bed";
    BedConfigurations["DoubleBed"] = "Double Bed";
    BedConfigurations["TwinBeds"] = "Twin Beds";
    BedConfigurations["BunkBeds"] = "Bunk Beds";
    BedConfigurations["Single"] = "Single Bed";
})(BedConfigurations || (BedConfigurations = {}));
const cabinSchema = new mongoose_1.Schema({
    cabinName: {
        type: String,
        required: [true, "This field is required"],
        unique: true,
    },
    cabinType: {
        type: String,
        required: [true, "This field is required"],
        default: CabinTypes.Standard,
        enum: Object.values(CabinTypes),
    },
    images: { type: [String], required: [true, "This field is required"] },
    floor: { type: String, required: [true, "This field is required"] },
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
    availability: {
        type: Boolean,
        required: [true, "This field is required"],
        default: true,
    },
    amenities: {
        type: [String],
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
    description: {
        type: String,
    },
    viewType: {
        type: String,
        enum: ViewTypeEnum,
    },
    hotelId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
});
exports.CabinModel = mongoose_1.default.model("Cabin", cabinSchema);
