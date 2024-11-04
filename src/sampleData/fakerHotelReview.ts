import { faker } from "@faker-js/faker/locale/en_US";
import { hotelId } from "./hotelds";
import { GuestId } from "./guestId";

export function generateHotelRewiewData() {
  return {
    rates: {
      "comfort and cleanliness": faker.number.float({ max: 5, min: 1 }),
      "facilities and aminities": faker.number.float({ max: 5, min: 1 }),
      "Overall Experience": faker.number.float({ max: 5, min: 1 }),
      "services and staff": faker.number.float({ max: 5, min: 1 }),
      location: faker.number.float({ max: 5, min: 1 }),
      "value for Money": faker.number.float({ max: 5, min: 1 }),
    },
    averageRate: faker.number.float({ max: 5, min: 1 }),
    review: faker.lorem.paragraph({ max: 10, min: 7 }),
    hotel: hotelId(),
    guest: GuestId(),
  };
}
