"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./controllers/cabinControllers");
const app_1 = __importDefault(require("./app"));
const dataUploader_1 = require("./sampleData/dataUploader");
dotenv_1.default.config();
const port = process.env.PORT || 8000;
const cloudUrl = process.env.MONGO_CLOUD.replace("<password>", process.env.MONGO_PASSWORD);
// const localUrl = process.env.MONGO_LOCAL;
const db = mongoose_1.default.connect(cloudUrl);
db.then(() => {
    console.log("mongodb connect sucessfully!");
    (0, dataUploader_1.dataUloader)();
});
app_1.default.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
