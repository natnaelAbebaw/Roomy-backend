"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFiles = void 0;
const metadataKeys_1 = require("./metadataKeys");
require("reflect-metadata");
function UploadFiles(fieldName) {
    return function (target, key, disc) {
        Reflect.defineMetadata(metadataKeys_1.metadataKeys.uploadFiles, fieldName, target, key);
    };
}
exports.UploadFiles = UploadFiles;
