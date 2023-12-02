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
  name: string;
  cabinType: string;
  images: string[];
  floor: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  amenities: string[];
  bedConfigurations: [string];
  description: string;
  viewType: string;
  hotel: ObjectId;
  numBeds: number;
}

enum BedConfigurations {
  KingBed = "King Bed",
  QueenBed = "Queen Bed",
  DoubleBed = "Double Bed",
  TwinBeds = "Twin Beds",
  BunkBeds = "Bunk Beds",
  Single = "Single Bed",
}

const cabinSchema = new Schema<Cabin>(
  {
    name: {
      type: String,
      required: [true, "This field is required"],
      unique: true,
    },
    cabinType: {
      type: String,
      required: [true, "This field is required"],
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
    numBeds: { type: Number, default: 1 },
    description: {
      type: String,
    },
    viewType: {
      type: String,
      enum: ViewTypeEnum,
    },
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
  },
  { timestamps: true }
);

export const CabinModel = mongoose.model("Cabin", cabinSchema);
