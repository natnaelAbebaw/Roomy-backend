"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./controllers/index");
// import "./sampleData/dataUploader";
const app_1 = __importDefault(require("./app"));
// import { guestDataUploader } from "./sampleData/guestDataUploader";
// import { hotelRewiewUploader } from "./sampleData/hotelReviewUploader";
// import { hotelDataUploader } from "./sampleData/HotelDataUploader";
// import { cabinDataUploader } from "./sampleData/cabinDataUploader";
// import { bookingDataUploader } from "./sampleData/bookingDateUploader";
// import { addMoreHotelhotel } from "./sampleData/addMoreHotels";
// import { CabinUploaderForHotel } from "./sampleData/CabinUploaderForHotel";
// import { todaysBookingDataUploader } from "./sampleData/TodaysBookingDateUploader";
// import { HotelModel } from "./models/hotelModel";
dotenv_1.default.config();
const port = process.env.PORT || 8000;
const cloudUrl = process.env.MONGO_CLOUD.replace("<password>", process.env.MONGO_PASSWORD);
// const localUrl = process.env.MONGO_LOCAL;
const db = mongoose_1.default.connect(cloudUrl);
db.then(() => {
    console.log("mongodb connect sucessfully!");
    // hotelDataUploader(HotelModel, "./src/sampleData/hotelData.json");
    // addMoreHotelhotel("./src/sampleData/hotelData.json");
    // bookingDataUploader();
    // hotelRewiewUploader();
    // cabinDataUploader();
    // guestDataUploader();
    // CabinUploaderForHotel("672bb69334c2f5fe23399a1b");
    // todaysBookingDataUploader();
});
app_1.default.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
