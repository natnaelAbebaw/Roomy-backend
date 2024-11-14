"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const metadataKeys_1 = require("./metadataKeys");
const accounts_1 = require("./accounts");
require("reflect-metadata");
function protect(account = accounts_1.accounts.all) {
    return function (target, key, disc) {
        Reflect.defineMetadata(metadataKeys_1.metadataKeys.protected, account, target, key);
    };
}
exports.protect = protect;
function restrictTo(...roles) {
    return function (target, key, disc) {
        Reflect.defineMetadata(metadataKeys_1.metadataKeys.restrictTo, roles, target, key);
    };
}
exports.restrictTo = restrictTo;
