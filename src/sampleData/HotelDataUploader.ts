import { Model } from "mongoose";
import fs from "fs";

import { fa, faker } from "@faker-js/faker";
import { HotelModel } from "../models/hotelModel";

export function hotelDataUploader(model: typeof Model, path: string) {
  const hotels = fs.readFileSync(path, "utf-8");

  const Hotels = JSON.parse(hotels);

  const mapHotels = Hotels.map((hotel: any) => {
    return {
      location: {
        city: hotel.city,
        state: hotel.state,
        country: hotel.country,
        zipcode: hotel.zipcode,
        continent: hotel.continent_name,
        coords: {
          lat: hotel.longitude,
          long: hotel.latitude,
        },
      },
      contacts: {
        email: faker.internet.email(),
        phone: faker.phone.number(),
        website: hotel.url,
      },

      name: hotel.hotel_name,
      address: hotel.addressline1,
      description: hotel.overview,
      currency: hotel.currencycode,
      countryISOCode: hotel.countryisocode,
      starRating: hotel.star_rating,
      checkinTime: hotel.checkin,
      checkoutTime: hotel.checkout,
      ratingAverage: hotel.rating_average,
      mainImage: faker.helpers.arrayElement([
        hotel.photo1,
        hotel.photo2,
        hotel.photo3,
        hotel.photo4,
        hotel.photo5,
      ]),
      albumImages: [
        hotel.photo1,
        hotel.photo2,
        hotel.photo3,
        hotel.photo4,
        hotel.photo5,
      ],
      facilities: faker.helpers.shuffle([
        "24-hour front desk",
        "Room service",
        "Laundry service",
        "Free Wi-Fi",
        "Swimming Pool",
        "Spa",
        "Gym",
        "Airport transfer",
        "FreeParking",
        "Restaurant",
        "Air Conditioning",
        "Swimming Pool",
        "Bar/lounge",
        "Conference room",
        "Business Center",
      ]),
      cabinTypes: faker.helpers.arrayElements(
        [
          "Single Bed",
          "Double Bed",
          "Twin Bed",
          "Triple Bed",
          "Quad Bed",
          "Queen Bed",
          "King Bed",
          "Suite",
          "Studio",
        ],
        3
      ),
      cabinCount: hotel.numberrooms ?? 10,
      priceRange: {
        min: faker.commerce.price(100, 300),
        max: faker.commerce.price(300, 600),
      },
      minBookingLength: faker.datatype.number({ min: 1, max: 3 }),
      maxBookingLength: faker.datatype.number({ min: 7, max: 14 }),
      popularfacilities: faker.helpers.arrayElements(
        [
          "Free Wi-Fi",
          "Spa",
          "Gym",
          "Airport transfer",
          "Free Parking",
          "Restaurant",
          "Air Conditioning",
          "Swimming Pool",
          "Bar/lounge",
          "Conference room",
          "Business Center",
          "Laundry Service",
          "Pets allowed",
          "Family rooms",
          "Balcony",
          "Elevator",
          "Heating",
        ],
        6
      ),
      breakFastPrice: faker.commerce.price(10, 200),
      cancellationPolicy: "Free cancellation within 48 hours of booking.",
      additionalPolicies: ["No pets allowed.", "Check-in time is 3 PM."],
    };
  });

  HotelModel.deleteMany({}).then(() => {
    HotelModel.create(mapHotels)
      .then(() => console.log("uploaded successfully"))
      .catch((err) => console.error(err));
  });
}
