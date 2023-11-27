"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = exports.router = void 0;
const metadataKeys_1 = require("./metadataKeys");
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
function controller(rootPath) {
    return function (target) {
        for (let key of Object.getOwnPropertyNames(target.prototype)) {
            const method = Reflect.getMetadata(metadataKeys_1.metadataKeys.method, target.prototype, key);
            const path = Reflect.getMetadata(metadataKeys_1.metadataKeys.path, target.prototype, key);
            if (path && method)
                exports.router.route(`${rootPath}${path}`)[method](target.prototype[key]);
        }
    };
}
exports.controller = controller;
