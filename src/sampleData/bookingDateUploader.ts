import { Model } from "mongoose";
import fs from "fs";

import { faker } from "@faker-js/faker";
import { BookingModel } from "../models/bookingModel";
import { generateBookingData } from "./fakerBooking";

export async function bookingDataUploader() {
  const fakeBooking = await Promise.all(
    faker.helpers.multiple(generateBookingData, {
      count: 1000,
    })
  );

  BookingModel.deleteMany({}).then(() => {
    BookingModel.create(fakeBooking)
      .then(() => console.log("uploaded successfully"))
      .catch((err) => console.error(err));
  });
}
