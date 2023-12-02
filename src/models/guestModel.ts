import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: {type: String, required: true},
  nationality: { type: String, required: true },
  nationalID: { type: String, required: true },
});

export const GuestModel = mongoose.model("Hotel", guestSchema);
