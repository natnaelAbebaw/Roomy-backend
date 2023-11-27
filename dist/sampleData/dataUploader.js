"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataUloader = void 0;
const fs_1 = __importDefault(require("fs"));
const cabinModel_1 = require("../models/cabinModel");
function dataUloader() {
    const cabins = fs_1.default.readFileSync("./src/sampleData/cabinData.json", "utf-8");
    cabinModel_1.CabinModel.create(JSON.parse(cabins))
        .then(() => console.log("uploaded successfully"))
        .catch((err) => console.error(err));
}
exports.dataUloader = dataUloader;
