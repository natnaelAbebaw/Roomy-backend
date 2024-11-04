import mongoose from "mongoose";

const cabinReviewSchema = new mongoose.Schema(
  {
    rates: {
      "Scenic Beauty": { type: Number, default: 1, min: 1, max: 5 },
      "Privacy and Seclusion": { type: Number, default: 1, min: 1, max: 5 },
      "Comfort and Coziness": { type: Number, default: 1, min: 1, max: 5 },
      "Outdoor Amenities": { type: Number, default: 1, min: 1, max: 5 },
      "Unique Features": { type: Number, default: 1, min: 1, max: 5 },
      "Overall Experience": { type: Number, default: 1, min: 1, max: 5 },
    },
    review: { type: String, index: true },
    guest: { type: mongoose.Schema.ObjectId, ref: "Guest", required: true },
    cabin: { type: mongoose.Schema.ObjectId, ref: "Cabin", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

cabinReviewSchema.index({ review: "text" });

cabinReviewSchema.virtual("averageRate").get(function (this: any) {
  const rates: number[] = Object.values(this.rates);
  const averageRate = rates.reduce((acc, rate) => acc + rate, 0) / rates.length;
  return averageRate;
});

export const CabinReviewModel = mongoose.model(
  "CabinReview",
  cabinReviewSchema
);
