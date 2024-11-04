import { faker } from "@faker-js/faker/locale/en_US";
import { HotelModel } from "../models/hotelModel";
import { Cabin, CabinModel } from "../models/cabinModel";
import { cabinId } from "./cabinId";
import { GuestId } from "./guestId";

export async function generateBookingData() {
  const cabin = faker.helpers.arrayElement(cabinId);

  const cabinOB: any = await CabinModel.find({ _id: cabin });
  const type = faker.helpers.arrayElement(["arriving", "departing"]);
  const maxDays = 10;
  const randomDays = Math.floor(Math.random() * maxDays) + 1;

  const data =
    type === "arriving"
      ? new Date()
      : new Date(new Date().setDate(new Date().getDate() - randomDays));

  const checkOutDate =
    type === "departing"
      ? new Date()
      : new Date(new Date().setDate(new Date().getDate() + randomDays));

  return {
    guest: GuestId(),
    cabin: cabin,
    hotel: cabinOB[0].hotel,
    checkInDate: data,
    checkOutDate: checkOutDate,
    cabinPrice: cabinOB[0].regularPrice,
    extrasPrice: faker.datatype.number({ min: 0, max: 100 }),
    totalPrice:
      cabinOB[0].regularPrice + faker.datatype.number({ min: 0, max: 100 }),
    hasBreakfast: faker.datatype.boolean(),
    paymentStatus: faker.helpers.arrayElement(["pending", "paid"]),
    status: faker.helpers.arrayElement([
      "checkedin",
      "checkedout",
      "unconfirmed",
    ]),
    createdAt: data,
  };
}
