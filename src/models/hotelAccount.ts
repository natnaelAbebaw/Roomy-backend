import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const GuestModel = mongoose.model("Hotel", guestSchema);
