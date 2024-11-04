import { Guest } from "./guestModel";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

interface HotelReview extends mongoose.Document {
  rates: {
    "comfort and cleanliness": number;
    "facilities and aminities": number;
    "Overall Experience": number;
    "services and staff": number;
    location: number;
    "value for Money": number;
  };
  review: string;
  hotel: ObjectId;
  guest: ObjectId;
  avarageRating: number;
}

const hotelReviewSchema = new mongoose.Schema(
  {
    rates: {
      "comfort and cleanliness": { type: Number, default: 1 },
      "facilities and aminities": { type: Number, default: 1 },
      "Overall Experience": { type: Number, default: 1 },
      "services and staff": { type: Number, default: 1 },
      location: { type: Number, default: 1 },
      "value for Money": { type: Number, default: 1 },
    },
    avarageRating: { type: Number, default: 1 },
    review: { type: String, index: true },
    hotel: { type: mongoose.Schema.ObjectId, ref: "Hotel", required: true },
    guest: { type: mongoose.Schema.ObjectId, ref: "Guest", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

hotelReviewSchema.index({ review: "text" });

hotelReviewSchema.pre(/^find/, function (this: HotelReview, next) {
  this.populate({
    path: "guest",
    select: "fullName userName email avatarUrl address",
  });

  next();
});

hotelReviewSchema.pre("save", function (this: HotelReview, next) {
  const rates: number[] = Object.values(this.rates);
  const averageRate = rates.reduce((acc, rate) => acc + rate, 0) / rates.length;
  this.avarageRating = averageRate;
  next();
});

export const HotelReviewModel = mongoose.model(
  "HotelReview",
  hotelReviewSchema
);
