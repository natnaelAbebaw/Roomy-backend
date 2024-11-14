"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CabinUploaderForHotel = void 0;
const faker_1 = require("@faker-js/faker");
const fakerCabin_1 = require("./fakerCabin");
const cabinModel_1 = require("../models/cabinModel");
function CabinUploaderForHotel(hotelId) {
    const fakeCabins = faker_1.faker.helpers.multiple(() => (0, fakerCabin_1.generateCabinData)(hotelId), {
        count: 200,
    });
    // CabinModel.deleteMany({}).then(() => {
    cabinModel_1.CabinModel.create(fakeCabins)
        .then(() => console.log("uploaded successfully"))
        .catch((err) => console.error(err));
    // });
}
exports.CabinUploaderForHotel = CabinUploaderForHotel;
