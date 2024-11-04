import mongoose, { Document } from "mongoose";

export interface Hotel extends Document {
  name: string;
  location: {
    city: string;
    state: string;
    country: string;
    zipcode: string;
    continent: string;
    coords: {
      lat: string;
      long: string;
    };
  };
  contacts: {
    email: String;
    phone: String;
    website: String;
  };
  currency: string;
  address: string;
  ratingAverage: number;
  countryISOCode: string;
  starRating: number;
  checkinTime: string;
  checkoutTime: string;
  discount: number;
  mainImage: string;
  albumImages: string[];
  facilities: string[];
  cabinTypes: string[];
  description: string;
  cancellationPolicy: string;
  cabinCount: number;
  priceRange: { min: number; max: number };
  additionalPolicies: string[];
  minBookingLength: number;
  maxBookingLength: number;
  popularfacilities: string[];
  breakFastPrice: number;
  hotelAccount: mongoose.Schema.Types.ObjectId;
  stripeAccountId: string;
}

enum PopularFacilitiesEnum {
  wifi = "Free Wi-Fi",
  spa = "Spa",
  gym = "Gym",
  airportRransfer = "Airport transfer",
  freeParking = "Free Parking",
  restaurant = "Restaurant",
  airConditioning = "Air Conditioning",
  swimmingPool = "Swimming Pool",
  bar = "Bar/lounge",
  conferenceRoom = "Conference room",
  businessCenter = "Business Center",
  laundryService = "Laundry Service",
  petsAllowed = "Pets allowed",
  familyRooms = "Family rooms",
  balcony = "Balcony",
  elevator = "Elevator",
  heating = "Heating",
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

const hotelSchema = new mongoose.Schema<Hotel>(
  {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "HotelAccount",
      requried: true,
    },
    stripeAccountId: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

hotelSchema.virtual("cabins", {
  ref: "Cabin",
  localField: "_id",
  foreignField: "hotel",
});

export const HotelModel = mongoose.model<Hotel>("Hotel", hotelSchema);
