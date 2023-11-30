import fs from "fs";
import { HotelModel } from "../models/hotelModel";

export function dataUloader() {
  const hotels = fs.readFileSync("./src/sampleData/hotelData.json", "utf-8");
  HotelModel.create(JSON.parse(hotels))
    .then(() => console.log("uploaded successfully"))
    .catch((err) => console.error(err));
}
