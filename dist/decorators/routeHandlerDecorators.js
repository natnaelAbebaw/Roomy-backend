"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.put = exports.del = exports.patch = exports.post = exports.get = void 0;
const metadataKeys_1 = require("./metadataKeys");
const methods_1 = require("./methods");
require("reflect-metadata");
function routeHandler(method) {
    return function (path = "") {
        return function (target, key, disc) {
            Reflect.defineMetadata(metadataKeys_1.metadataKeys.method, method, target, key);
            Reflect.defineMetadata(metadataKeys_1.metadataKeys.path, path, target, key);
        };
    };
}
exports.get = routeHandler(methods_1.methods.get);
exports.post = routeHandler(methods_1.methods.post);
exports.patch = routeHandler(methods_1.methods.patch);
exports.del = routeHandler(methods_1.methods.delete);
exports.put = routeHandler(methods_1.methods.put);
