"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const metadataKeys_1 = require("./metadataKeys");
const authController_1 = require("./authController");
const routeHandlersController_1 = require("./routeHandlersController");
const Routers_1 = require("./Routers");
const express_1 = require("express");
const UploadFilesController_1 = require("./UploadFilesController");
function controller(rootPath, options) {
    return function (target) {
        const router = (0, express_1.Router)({ mergeParams: true });
        Routers_1.routers[target.name] = router;
        if (options && options.nestedRoutes) {
            options.nestedRoutes.forEach((nestedRoute) => {
                router.use(`${rootPath}/:${rootPath.slice(1)}Id`, Routers_1.routers[nestedRoute.name]);
            });
        }
        for (let key of Object.getOwnPropertyNames(target.prototype)) {
            const method = Reflect.getMetadata(metadataKeys_1.metadataKeys.method, target.prototype, key);
            const path = Reflect.getMetadata(metadataKeys_1.metadataKeys.path, target.prototype, key) || "";
            const protect = Reflect.getMetadata(metadataKeys_1.metadataKeys.protected, target.prototype, key);
            const restrictTo = Reflect.getMetadata(metadataKeys_1.metadataKeys.restrictTo, target.prototype, key);
            const fileFieldName = Reflect.getMetadata(metadataKeys_1.metadataKeys.uploadFiles, target.prototype, key);
            // protected functionality
            if (method) {
                let funcStack = [
                    (0, routeHandlersController_1.routerHander)(target.prototype[key], target.prototype),
                ];
                if (fileFieldName) {
                    funcStack = [(0, UploadFilesController_1.UploadFilesFunc)(fileFieldName), ...funcStack];
                }
                if (restrictTo) {
                    funcStack = [(0, authController_1.restrictToFunc)(restrictTo), ...funcStack];
                }
                if (protect) {
                    funcStack = [(0, authController_1.protectFunc)(protect), ...funcStack];
                }
                router.route(`${rootPath}${path}`)[method](...funcStack);
            }
        }
    };
}
exports.controller = controller;
