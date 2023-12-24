import { metadataKeys } from "./metadataKeys";
import { methods } from "./methods";
import { protectFunc, restrictToFunc } from "./authController";
import { routerHander } from "./routeHandlersController";

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

      // protected functionality

      if (method) {
        const router = target.getRouter();
        let funcStack: Function[] = [
          routerHander(target.prototype[key], target.prototype),
        ];

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
