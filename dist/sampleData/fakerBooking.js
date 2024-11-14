"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBookingData = void 0;
const en_US_1 = require("@faker-js/faker/locale/en_US");
const cabinModel_1 = require("../models/cabinModel");
const cabinId_1 = require("./cabinId");
const guestId_1 = require("./guestId");
function generateBookingData() {
    return __awaiter(this, void 0, void 0, function* () {
        const cabin = en_US_1.faker.helpers.arrayElement(cabinId_1.cabinId);
        const cabinOB = yield cabinModel_1.CabinModel.find({ _id: cabin });
        const data = en_US_1.faker.date.between(new Date(new Date().setDate(new Date().getDate() - 90)).toISOString(), new Date().toISOString());
        const data2 = new Date(data);
        const maxDays = 10;
        const randomDays = Math.floor(Math.random() * maxDays) + 1;
        const checkOutDate = new Date(data2.setDate(data2.getDate() + randomDays));
        return {
            guest: (0, guestId_1.GuestId)(),
            cabin: cabin,
            hotel: cabinOB[0].hotel,
            checkInDate: data,
            checkOutDate: checkOutDate,
            numNight: en_US_1.faker.datatype.number({ min: 1, max: 30 }),
            cabinPrice: cabinOB[0].regularPrice,
            extrasPrice: en_US_1.faker.datatype.number({ min: 0, max: 100 }),
            totalPrice: cabinOB[0].regularPrice + en_US_1.faker.datatype.number({ min: 0, max: 100 }),
            hasBreakfast: en_US_1.faker.datatype.boolean(),
            paymentStatus: en_US_1.faker.helpers.arrayElement(["pending", "paid"]),
            status: en_US_1.faker.helpers.arrayElement([
                "checkedin",
                "checkedout",
                "unconfirmed",
            ]),
            createdAt: data,
        };
    });
}
exports.generateBookingData = generateBookingData;
