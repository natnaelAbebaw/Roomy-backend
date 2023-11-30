import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
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
  cancellationPolicy: String,
  additionalPolicies: [String],
});

export const HotelModel = mongoose.model("Hotel", hotelSchema);

