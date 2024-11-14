import { CabinModel } from "./models/cabinModel";
import mongoose from "mongoose";
import dotenv from "dotenv";

import "./controllers/index";
// import "./sampleData/dataUploader";

import App from "./app";
// import { guestDataUploader } from "./sampleData/guestDataUploader";
// import { hotelRewiewUploader } from "./sampleData/hotelReviewUploader";
// import { hotelDataUploader } from "./sampleData/HotelDataUploader";
// import { cabinDataUploader } from "./sampleData/cabinDataUploader";
// import { bookingDataUploader } from "./sampleData/bookingDateUploader";
// import { addMoreHotelhotel } from "./sampleData/addMoreHotels";
// import { CabinUploaderForHotel } from "./sampleData/CabinUploaderForHotel";
// import { todaysBookingDataUploader } from "./sampleData/TodaysBookingDateUploader";
// import { HotelModel } from "./models/hotelModel";

dotenv.config();
const port = process.env.PORT || 8000;

const cloudUrl = (process.env.MONGO_CLOUD as string).replace(
  "<password>",
  process.env.MONGO_PASSWORD as string
);
// const localUrl = process.env.MONGO_LOCAL;
const db = mongoose.connect(cloudUrl);

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

App.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
