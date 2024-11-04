import { faker } from "@faker-js/faker/locale/en_US";
import { hotelId } from "./hotelds";

export function generateGuestData() {
  return {
    fullName: faker.name.fullName(),
    userName: faker.name.firstName(),
    email: faker.internet.email(),
    password: "87654321",
    avatarUrl: faker.helpers.arrayElement([
      "https://plus.unsplash.com/premium_photo-1669882305273-674eff6567af",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      "https://plus.unsplash.com/premium_photo-1674777843203-da3ebb9fbca0",
      "https://images.unsplash.com/photo-1556157382-97eda2d62296",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9",
      "https://images.unsplash.com/photo-1558203728-00f45181dd84",
      "https://images.unsplash.com/photo-1537511446984-935f663eb1f4",
    ]),
    nationality: faker.location.country(),
    nationalID: faker.datatype.number({ min: 1000000000, max: 9999999999 }),
    confirmPassword: "87654321",
    address: {
      city: faker.location.city(),
      country: faker.location.country(),
    },
  };
}
