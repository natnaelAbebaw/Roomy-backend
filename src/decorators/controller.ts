import { get } from "mongoose";
import { metadataKeys } from "./metadataKeys";
import { methods } from "./methods";
import express, { NextFunction, Request, Response } from "express";

export function controller(rootPath: string) {
  return function (target: any) {
    for (let key of Object.getOwnPropertyNames(target.prototype)) {
      const method: methods = Reflect.getMetadata(
        metadataKeys.method,
        target.prototype,
        key
      );
      const path =
        Reflect.getMetadata(metadataKeys.path, target.prototype, key) || "";
      async function routerHander(
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        try {
          const fuc = await target.prototype[key]();
          await fuc(req, res, next);
        } catch (err) {
          next(err);
        }
      }
      const router = target.getRouter();

      if (method) router.route(`${rootPath}${path}`)[method](routerHander);
    }
  };

}
