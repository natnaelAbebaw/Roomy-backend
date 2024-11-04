import { metadataKeys } from "./metadataKeys";
import { methods } from "./methods";
import { protectFunc, restrictToFunc } from "./authController";
import { routerHander } from "./routeHandlersController";
import { routers } from "./Routers";
import { Request, Response, Router } from "express";
import { UploadFilesFunc } from "./UploadFilesController";

export function controller(
  rootPath: string,
  options?: { nestedRoutes: any[] }
) {
  return function (target: any) {
    const router = Router({ mergeParams: true });
    routers[target.name] = router;
    if (options && options.nestedRoutes) {
      options.nestedRoutes.forEach((nestedRoute) => {
        router.use(
          `${rootPath}/:${rootPath.slice(1)}Id`,
          routers[nestedRoute.name]
        );
      });
    }

    for (let key of Object.getOwnPropertyNames(target.prototype)) {
      const method: methods = Reflect.getMetadata(
        metadataKeys.method,
        target.prototype,
        key
      );

      const path =
        Reflect.getMetadata(metadataKeys.path, target.prototype, key) || "";
      const protect = Reflect.getMetadata(
        metadataKeys.protected,
        target.prototype,
        key
      );
      const restrictTo = Reflect.getMetadata(
        metadataKeys.restrictTo,
        target.prototype,
        key
      );

      const fileFieldName = Reflect.getMetadata(
        metadataKeys.uploadFiles,
        target.prototype,
        key
      );

      // protected functionality

      if (method) {
        let funcStack: any[] = [
          routerHander(target.prototype[key], target.prototype),
        ];

        if (fileFieldName) {
          funcStack = [UploadFilesFunc(fileFieldName), ...funcStack];
        }

        if (restrictTo) {
          funcStack = [restrictToFunc(restrictTo), ...funcStack];
        }

        if (protect) {
          funcStack = [protectFunc(protect), ...funcStack];
        }

        router.route(`${rootPath}${path}`)[method](...funcStack);
      }
    }
  };
}
