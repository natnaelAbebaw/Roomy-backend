"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guestDataUploader = void 0;
const faker_1 = require("@faker-js/faker");
const fakerGuests_1 = require("./fakerGuests");
const guestModel_1 = require("../models/guestModel");
function guestDataUploader() {
    const GuestCabins = faker_1.faker.helpers.multiple(fakerGuests_1.generateGuestData, {
        count: 200,
    });
    guestModel_1.GuestModel.deleteMany({}).then(() => {
        guestModel_1.GuestModel.create(GuestCabins)
            .then(() => console.log("uploaded successfully"))
            .catch((err) => console.error(err));
    });
}
exports.guestDataUploader = guestDataUploader;
