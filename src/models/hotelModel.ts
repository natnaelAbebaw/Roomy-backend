import mongoose, { Document } from "mongoose";

export interface Hotel extends Document {
  name: string;
  location: {
    city: string;
    state: string;
    country: string;
    zipcode: string;
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
  address: string;
  rating: number;
  regularPrice: number;
  discount: number;
  images: string[];
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
  freeParking = "FreeParking",
  restaurant = "Restaurant",
  airConditioning = "Air Conditioning",
  swimmingPool = "Swimming Pool",
  bar = "Bar/lounge",
  conferenceRoom = "Conference room",
  businessCenter = "Business Center",
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
    rating: { type: Number, default: 0 },
    images: [String],
    facilities: [String],
    cabinTypes: [String],
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
    hotelAccount: { type: mongoose.Schema.Types.ObjectId, ref: "HotelAccount" ,requried:true},
    stripeAccountId: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

hotelSchema.virtual("cabins", {
  ref: "Cabin",
  localField: "_id",
  foreignField: "hotel",
});

export const HotelModel = mongoose.model("Hotel", hotelSchema);
