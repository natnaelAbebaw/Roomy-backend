import { upload } from "../services/multer";

export function UploadFilesFunc(fieldName: string) {
  return upload.array(fieldName);
}
