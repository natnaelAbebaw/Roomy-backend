import { CabinModel } from "./models/cabinModel";
import mongoose from "mongoose";
import dotenv from "dotenv";
import "./controllers/index";

import App from "./app";
import { dataUloader } from "./sampleData/dataUploader";
import { HotelModel } from "./models/hotelModel";
import { BookingModel } from "./models/bookingModel";

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
  // dataUloader(CabinModel, "./src/sampleData/cabinData.json");
  // dataUloader(HotelModel, "./src/sampleData/hotelData.json");
  // dataUloader(BookingModel, "./src/sampleData/bookingData.json");
});

App.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
