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
exports.todaysBookingDataUploader = void 0;
const faker_1 = require("@faker-js/faker");
const bookingModel_1 = require("../models/bookingModel");
const todaysFakerBooking_1 = require("./todaysFakerBooking");
function todaysBookingDataUploader() {
    return __awaiter(this, void 0, void 0, function* () {
        const fakeBooking = yield Promise.all(faker_1.faker.helpers.multiple(todaysFakerBooking_1.generateBookingData, {
            count: 50,
        }));
        bookingModel_1.BookingModel.create(fakeBooking)
            .then(() => console.log("uploaded successfully"))
            .catch((err) => console.error(err));
    });
}
exports.todaysBookingDataUploader = todaysBookingDataUploader;
