import { ObjectId } from "mongodb";
import mongoose, { Schema, Document } from "mongoose";

enum ViewTypeEnum {
  NONE = "None",
  OCEAN = "Ocean View",
  MOUNTAIN = "Mountain View",
  CITY = "City View",
  GARDEN = "Garden View",
  LAKE = "Lake View",
  POOL = "Pool View",
  COURTYARD = "Courtyard View",
  WILDLIFE = "Wildlife View",
  PARTIAL = "Partial View",
  PARK = "Park View",
  FOREST = "Forest View",
}

export interface Cabin extends Document {
  cabinName: string;
  cabinType: string;
  images: string[];
  floor: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  availability: boolean;
  amenities: string[];
  bedConfigurations: [string];
  description: string;
  viewType: string;
  hotelId: ObjectId;
}

enum CabinTypes {
  DeluxeSuite = "Deluxe Suite",
  FamilyCabin = "Family Cabin",
  HoneymoonSuite = "Honeymoon Suite",
  LogCabin = "Log Cabin",
  CityLoft = "City Loft",
  SpaRetreat = "Spa Retreat",
  LuxuryPenthouse = "Luxury Penthouse",
  BeachfrontCottage = "Beachfront Cottage",
  MountainLodge = "Mountain Lodge",
  GreenSuite = "Green Suite",
  Standard = "Standard",
  Deluxe = "deluxe",
  Suite = "suite",
}

enum BedConfigurations {
  KingBed = "King Bed",
  QueenBed = "Queen Bed",
  DoubleBed = "Double Bed",
  TwinBeds = "Twin Beds",
  BunkBeds = "Bunk Beds",
  Single = "Single Bed",
}

const cabinSchema = new Schema<Cabin>({
  cabinName: {
    type: String,
    required: [true, "This field is required"],
    unique: true as boolean,
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
      validator: function (this: Cabin, val: number): boolean {
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
    type: Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
});

export const CabinModel = mongoose.model("Cabin", cabinSchema);
