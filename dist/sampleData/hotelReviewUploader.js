"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotelRewiewUploader = void 0;
const faker_1 = require("@faker-js/faker");
const hotelReviewModel_1 = require("../models/hotelReviewModel");
const fakerHotelReview_1 = require("./fakerHotelReview");
function hotelRewiewUploader() {
    const fakeReview = faker_1.faker.helpers.multiple(fakerHotelReview_1.generateHotelRewiewData, {
        count: 20000,
    });
    hotelReviewModel_1.HotelReviewModel.deleteMany({}).then(() => {
        hotelReviewModel_1.HotelReviewModel.create(fakeReview)
            .then(() => console.log("uploaded successfully"))
            .catch((err) => console.error(err));
    });
}
exports.hotelRewiewUploader = hotelRewiewUploader;
