import { metadataKeys } from "./metadataKeys";
import "reflect-metadata";

export function UploadFiles(fieldName: string) {
  return function (target: any, key: string, disc: PropertyDescriptor) {
    Reflect.defineMetadata(metadataKeys.uploadFiles, fieldName, target, key);
  };
}
