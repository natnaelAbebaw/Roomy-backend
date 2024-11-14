"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHotelRewiewData = void 0;
const en_US_1 = require("@faker-js/faker/locale/en_US");
const hotelds_1 = require("./hotelds");
const guestId_1 = require("./guestId");
function generateHotelRewiewData() {
    return {
        rates: {
            "comfort and cleanliness": en_US_1.faker.number.float({ max: 5, min: 1 }),
            "facilities and aminities": en_US_1.faker.number.float({ max: 5, min: 1 }),
            "Overall Experience": en_US_1.faker.number.float({ max: 5, min: 1 }),
            "services and staff": en_US_1.faker.number.float({ max: 5, min: 1 }),
            location: en_US_1.faker.number.float({ max: 5, min: 1 }),
            "value for Money": en_US_1.faker.number.float({ max: 5, min: 1 }),
        },
        averageRate: en_US_1.faker.number.float({ max: 5, min: 1 }),
        review: en_US_1.faker.lorem.paragraph({ max: 10, min: 7 }),
        hotel: (0, hotelds_1.hotelId)(),
        guest: (0, guestId_1.GuestId)(),
    };
}
exports.generateHotelRewiewData = generateHotelRewiewData;
