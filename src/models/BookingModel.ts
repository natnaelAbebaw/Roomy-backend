import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },
    cabin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cabin",
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    numNight: String,
    cabinPrice: {
      type: Number,
      required: true,
    },
    extrasPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["checkin", "checkout", "unconfirmed", "cancelled"],
    },
    hasBreakfast: {
      type: Boolean,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Create and export the Booking model
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
