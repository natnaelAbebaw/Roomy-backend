import { Model } from "mongoose";

import { fa, faker } from "@faker-js/faker";
import { HotelReviewModel } from "../models/hotelReviewModel";
import { generateHotelRewiewData } from "./fakerHotelReview";

export function hotelRewiewUploader() {
  const fakeReview = faker.helpers.multiple(generateHotelRewiewData, {
    count: 20000,
  });

  HotelReviewModel.deleteMany({}).then(() => {
    HotelReviewModel.create(fakeReview)
      .then(() => console.log("uploaded successfully"))
      .catch((err) => console.error(err));
  });
}
