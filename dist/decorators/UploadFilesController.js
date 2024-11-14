"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFilesFunc = void 0;
const multer_1 = require("../services/multer");
function UploadFilesFunc(fieldName) {
    return multer_1.upload.array(fieldName);
}
exports.UploadFilesFunc = UploadFilesFunc;
