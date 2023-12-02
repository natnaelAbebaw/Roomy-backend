import { Model } from "mongoose";
import fs from "fs";

export function dataUloader(model: typeof Model, path: string) {
  const hotels = fs.readFileSync(path, "utf-8");
  model.deleteMany({}).then(() => {
    model
      .create(JSON.parse(hotels))
      .then(() => console.log("uploaded successfully"))
      .catch((err) => console.error(err));
  });
}
