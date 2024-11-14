import { Model } from "mongoose";
import fs from "fs";

import { faker } from "@faker-js/faker";
import { generateCabinData } from "./fakerCabin";
import { CabinModel } from "../models/cabinModel";

export function CabinUploaderForHotel(hotelId?: string) {
  const fakeCabins = faker.helpers.multiple(() => generateCabinData(hotelId), {
    count: 200,
  });

  // CabinModel.deleteMany({}).then(() => {
  CabinModel.create(fakeCabins)
    .then(() => console.log("uploaded successfully"))
    .catch((err) => console.error(err));
  // });
}
