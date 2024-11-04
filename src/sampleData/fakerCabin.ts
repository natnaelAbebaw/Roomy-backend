import { faker } from "@faker-js/faker/locale/en_US";
import { hotelId } from "./hotelds";
import {
  amenities,
  BedConfigurations,
  CabinTypes,
  ViewTypeEnum,
} from "../models/cabinModel";

export function generateCabinData(hotelid?: string) {
  return {
    name: faker.lorem.words(2),
    cabinType: faker.helpers.arrayElement(Object.values(CabinTypes)),
    mainImage: faker.helpers.arrayElement([
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWwlMjBiZWRzfGVufDB8fDB8fHww",
      "https://plus.unsplash.com/premium_photo-1661963119619-e0e4bab009f7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG90ZWwlMjBiZWRzfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1686782502386-f3f3114ed9b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1661964175219-36f300b0e833?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1687996106476-9e851e2b0eba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1626868449668-fb47a048d9cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1648383228240-6ed939727ad6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1661901997525-fdbfb88d8554?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1657639754502-3c138cb24b4c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1592229505678-cf99a9908e03?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1611971263023-105938ce12ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
    ]),
    albumImages: faker.helpers.arrayElements(
      [
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWwlMjBiZWRzfGVufDB8fDB8fHww",
        "https://plus.unsplash.com/premium_photo-1661963119619-e0e4bab009f7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG90ZWwlMjBiZWRzfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1686782502386-f3f3114ed9b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1661964175219-36f300b0e833?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1687996106476-9e851e2b0eba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1626868449668-fb47a048d9cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1648383228240-6ed939727ad6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1661901997525-fdbfb88d8554?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1657639754502-3c138cb24b4c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1592229505678-cf99a9908e03?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1611971263023-105938ce12ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fGhvdGVsJTIwYmVkc3xlbnwwfHwwfHx8MA%3D%3D",
      ],
      5
    ),
    floor: faker.datatype.number({ min: 1, max: 100 }),
    maxCapacity: faker.datatype.number({ min: 1, max: 10 }),
    regularPrice: faker.datatype.number({ min: 101, max: 1000 }),
    discount: faker.datatype.number({ min: 1, max: 100 }),
    amenities: faker.helpers.arrayElements(Object.values(amenities), 5),
    bedConfigurations: faker.helpers.arrayElements(
      Object.values(BedConfigurations),
      2
    ),
    description: faker.lorem.paragraph(),
    viewType: faker.helpers.arrayElement(Object.values(ViewTypeEnum)),
    hotel: hotelid ? hotelid : hotelId(),
    numBeds: faker.datatype.number({ min: 1, max: 5 }),
  };
}
