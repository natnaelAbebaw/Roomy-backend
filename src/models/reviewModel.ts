import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  rate: { type: String, required: true },
  comment: { type: String },
  hotel: { type: mongoose.Schema.ObjectId, ref: "Hotel", required: true },
  guest: { type: mongoose.Schema.ObjectId, ref: "Guest", required: true },
});

export const SettingModel = mongoose.model("Hotel", reviewSchema);
