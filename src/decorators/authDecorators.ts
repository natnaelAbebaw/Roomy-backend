import { metadataKeys } from "./metadataKeys";
import { accounts } from "./accounts";
import "reflect-metadata";

export function protect(account: string = accounts.all) {
  return function (target: any, key: string, disc: PropertyDescriptor) {
    Reflect.defineMetadata(metadataKeys.protected, account, target, key);
  };
}
export function restrictTo(...roles: string[]) {
  return function (target: any, key: string, disc: PropertyDescriptor) {
    Reflect.defineMetadata(metadataKeys.restrictTo, roles, target, key);
  };
}
