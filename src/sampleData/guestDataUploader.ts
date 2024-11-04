import { Guest } from "./../models/guestModel";
import { Model } from "mongoose";
import fs from "fs";

import { faker } from "@faker-js/faker";
import { generateGuestData } from "./fakerGuests";
import { GuestModel } from "../models/guestModel";

export function guestDataUploader() {
  const GuestCabins = faker.helpers.multiple(generateGuestData, {
    count: 200,
  });

  GuestModel.deleteMany({}).then(() => {
    GuestModel.create(GuestCabins)
      .then(() => console.log("uploaded successfully"))
      .catch((err) => console.error(err));
  });
}
