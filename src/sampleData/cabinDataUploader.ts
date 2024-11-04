import { Model } from "mongoose";
import fs from "fs";

import { faker } from "@faker-js/faker";
import { generateCabinData } from "./fakerCabin";
import { CabinModel } from "../models/cabinModel";

export function cabinDataUploader() {
  const fakeCabins = faker.helpers.multiple(generateCabinData, {
    count: 3000,
  });

  CabinModel.deleteMany({}).then(() => {
    CabinModel.create(fakeCabins)
      .then(() => console.log("uploaded successfully"))
      .catch((err) => console.error(err));
  });
}
