import { metadataKeys } from "./metadataKeys";
import { methods } from "./methods";
import "reflect-metadata";

function routeHandler(method: string) {
  return function (path: string = "") {
    return function (target: any, key: string, disc: PropertyDescriptor) {
      Reflect.defineMetadata(metadataKeys.method, method, target, key);
      Reflect.defineMetadata(metadataKeys.path, path, target, key);
    };
  };
}

export const get = routeHandler(methods.get);
export const post = routeHandler(methods.post);
export const patch = routeHandler(methods.patch);
export const del = routeHandler(methods.delete);
export const put = routeHandler(methods.put);
