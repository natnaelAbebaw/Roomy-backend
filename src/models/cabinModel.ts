import { ObjectId } from "mongodb";
import mongoose, { Schema, Document } from "mongoose";

export enum ViewTypeEnum {
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

export enum CabinTypes {
  singleBed = "Single Bed",
  doubleBed = "Double Bed",
  twinBed = "Twin Bed",
  tripleBed = "Triple Bed",
  quadBed = "Quad Bed",
  queenBed = "Queen Bed",
  kingBed = "King Bed",
  suite = "Suite",
  studio = "Studio",
}

export interface Cabin extends Document {
  name: string;
  cabinType: string;
  mainImage: string;
  albumImages: string[];
  floor: number;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  amenities: string[];
  bedConfigurations: string[];
  description: string;
  viewType: string;
  hotel: ObjectId;
  numBeds: number;
}

export enum amenities {
  Bed = "Bed",
  WiFi = "WiFi",
  AirConditioning = "Air Conditioning",
  Television = "Television",
  MiniFridge = "Mini Fridge",
  CoffeeTeaMaker = "Coffee/Tea Maker",
  RoomService = "Room Service",
  DeskAndChair = "Desk and Chair",
  Telephone = "Telephone",
  Wardrobe = "Wardrobe/Closet",
  Safe = "Safe",
  IronAndIroningBoard = "Iron and Ironing Board",
  Hairdryer = "Hairdryer",
  PrivateBathroom = "Private Bathroom",
  Toiletries = "Toiletries",
  TowelsAndBathrobe = "Towels and Bathrobe",
  Slippers = "Slippers",
  BlackoutCurtains = "Blackout Curtains",
  SoundproofWindows = "Soundproof Windows",
  Balcony = "Balcony or Window View",
  LaundryService = "Laundry Service",
  DailyHousekeeping = "Daily Housekeeping",
  AlarmClock = "Alarm Clock",
  USBChargingPorts = "USB Charging Ports",
}

export enum BedConfigurations {
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
        validator: function (this: Cabin, val: number): boolean {
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
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
  },
  { timestamps: true }
);

cabinSchema.index({ name: "text" });

export const CabinModel = mongoose.model("Cabin", cabinSchema);
