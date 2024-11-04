import { Model } from "mongoose";

import * as fs from "node:fs";

import { fa, faker } from "@faker-js/faker";
import { HotelModel } from "../models/hotelModel";
import { json } from "express";

export function addMoreHotelhotel(path: string) {
  const hotels = fs.readFileSync(path, "utf-8");

  const Hotels = JSON.parse(hotels);
  const newHotels = [...Hotels];
  for (let i = 0; i < 9; i++) {
    const mapHotels = Hotels.map((hotel: any) => {
      return {
        hotel_name: faker.company.buzzPhrase(),
        addressline1: "21 Alexandrovska Street",
        addressline2: "",
        zipcode: "8000",
        city: "Burgas",
        state: "",
        country: "Bulgaria",
        countryisocode: "BG",
        star_rating: faker.datatype.number({ min: 1, max: 5 }),
        longitude: hotel.longitude + 0.05,
        latitude: hotel.latitude + 0.05,
        url: "https://www.agoda.com/partners/partnersearch.aspx?hid=151",
        checkin: "",
        checkout: "12:00 PM",
        numberrooms: 120,
        numberfloors: null,
        yearopened: null,
        yearrenovated: null,
        photo1:
          "http://pix5.agoda.net/hotelimages/4884281/0/9dc9f52df1ed422b4c52657acdb90b2e.jpg?s=312x",
        photo2:
          "http://pix2.agoda.net/hotelimages/151/151/151_130703201220.jpg?s=312x",
        photo3:
          "http://pix3.agoda.net/hotelimages/4884281/0/61ed7fbd2aa24da66bb582f5171f646c.jpg?s=312x",
        photo4:
          "http://pix2.agoda.net/hotelimages/4884281/0/249257609a8bddcc19b384cb3af3c0a5.jpg?s=312x",
        photo5:
          "http://pix4.agoda.net/hotelimages/4884281/0/4f969a30a08b3fea5a0747823a8e1554.jpg?s=312x",
        overview:
          "Bulgaria Hotel is perfectly located for both business and leisure guests in Burgas. Featuring a complete list of amenities, guests will find their stay at the property a comfortable one. 24-hour room service, casino, facilities for disabled guests, Wi-Fi in public areas, car park are on the list of things guests can enjoy. All rooms are designed and decorated to make guests feel right at home, and some rooms come with television LCD/plasma screen, bathroom phone, fireplace, towels, closet. Entertain the hotel's recreational facilities, including hot tub, fitness center, sauna, outdoor pool, indoor pool. A welcoming atmosphere and excellent service are what you can expect during your stay at Bulgaria Hotel.",
        rates_from: 56,
        continent_id: 4,
        continent_name: "Europe",
        city_id: 16479,
        country_id: 126,
        number_of_reviews: 21,
        rating_average: faker.datatype.number({ min: 5, max: 10 }),
        rates_currency: "USD",
      };
    });

    newHotels.push(...mapHotels);
  }

  fs.writeFileSync(path, JSON.stringify(newHotels));
}

addMoreHotelhotel("./hotelData.json");
