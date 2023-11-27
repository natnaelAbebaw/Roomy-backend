import { MaxKey } from "mongodb";
import { metadataKeys } from "./metadataKeys";
import { methods } from "./methods";
import express from "express";
export const router = express.Router();
export function controller(rootPath: string) {
  return function (target: Function) {
    for (let key of Object.getOwnPropertyNames(target.prototype)) {
      const method: methods = Reflect.getMetadata(
        metadataKeys.method,
        target.prototype,
        key
      );
      const path =
        Reflect.getMetadata(metadataKeys.path, target.prototype, key) || "";
      if (method)
        router.route(`${rootPath}${path}`)[method](target.prototype[key]);
    }
  };
}
