import { Model } from "mongoose";
import fs from "fs";

import { faker } from "@faker-js/faker";
import { BookingModel } from "../models/bookingModel";
import { generateBookingData } from "./todaysFakerBooking";

export async function todaysBookingDataUploader() {
  const fakeBooking = await Promise.all(
    faker.helpers.multiple(generateBookingData, {
      count: 50,
    })
  );

  BookingModel.create(fakeBooking)
    .then(() => console.log("uploaded successfully"))
    .catch((err) => console.error(err));
}
