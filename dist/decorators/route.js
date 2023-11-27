"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.put = exports.del = exports.patch = exports.post = exports.get = void 0;
const metadataKeys_1 = require("./metadataKeys");
const methods_1 = require("./methods");
function routeHandler(method) {
    return function (path) {
        return function (target, key, disc) {
            Reflect.set(target, metadataKeys_1.metadataKeys.method, method, key);
            Reflect.set(target, metadataKeys_1.metadataKeys.path, path, key);
        };
    };
}
exports.get = routeHandler(methods_1.methods.get);
exports.post = routeHandler(methods_1.methods.post);
exports.patch = routeHandler(methods_1.methods.patch);
exports.del = routeHandler(methods_1.methods.delete);
exports.put = routeHandler(methods_1.methods.put);
