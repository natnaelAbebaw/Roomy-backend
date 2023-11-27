import fs from "fs";
import { CabinModel } from "../models/cabinModel";

export function dataUloader() {
  const cabins = fs.readFileSync("./src/sampleData/cabinData.json", "utf-8");
  CabinModel.create(JSON.parse(cabins))
    .then(() => console.log("uploaded successfully"))
    .catch((err) => console.error(err));
}
