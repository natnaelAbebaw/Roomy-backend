"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cabinDataUploader = void 0;
const faker_1 = require("@faker-js/faker");
const fakerCabin_1 = require("./fakerCabin");
const cabinModel_1 = require("../models/cabinModel");
function cabinDataUploader() {
    const fakeCabins = faker_1.faker.helpers.multiple(fakerCabin_1.generateCabinData, {
        count: 3000,
    });
    cabinModel_1.CabinModel.deleteMany({}).then(() => {
        cabinModel_1.CabinModel.create(fakeCabins)
            .then(() => console.log("uploaded successfully"))
            .catch((err) => console.error(err));
    });
}
exports.cabinDataUploader = cabinDataUploader;
