import mongoose, { Date } from "mongoose";
import { Document } from "mongoose";
import { differenceInDays } from "date-fns";

export interface Booking extends Document {
  guest: mongoose.Schema.Types.ObjectId | any;
  cabin: mongoose.Schema.Types.ObjectId | any;
  hotel: mongoose.Schema.Types.ObjectId | any;
  checkInDate: Date;
  checkOutDate: Date;
  numNight: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  hasBreakfast: boolean;
  paymentStatus: string;
  status: string;
}

const bookingSchema = new mongoose.Schema<Booking>(
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
      enum: ["checkedin", "checkedout", "unconfirmed"],
    },
    hasBreakfast: {
      type: Boolean,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

bookingSchema.virtual("numNights").get(function (this: Booking) {
  return differenceInDays(this.checkOutDate as any, this.checkInDate as any);
});

bookingSchema.pre(/^find/, function (this: any) {
  this.populate({
    path: "cabin",
    select: "name",
  }).populate({
    path: "guest",
    select: "fullName email nationalID nationality",
  });
});

export const BookingModel = mongoose.model("Booking", bookingSchema);
