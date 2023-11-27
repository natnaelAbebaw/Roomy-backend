import mongoose from "mongoose";
import dotenv from "dotenv";
import "./controllers/cabinControllers";
import App from "./app";
// import { dataUloader } from "./sampleData/dataUploader";

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
});

App.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
