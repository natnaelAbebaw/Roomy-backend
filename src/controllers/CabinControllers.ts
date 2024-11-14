import { NextFunction, Request, Response, Router } from "express";
import { controller } from "../decorators/controllerDecorator";
import { del, get, patch, post } from "../decorators/routeHandlerDecorators";
import { protect, restrictTo } from "../decorators/authDecorators";
import { Roles } from "../models/rolesModel";
import { CabinModel } from "../models/cabinModel";
import { ApiFeatures } from "../services/ApiFeatures";
import { Controller } from "../services/Controllers";
import { accounts } from "../decorators/accounts";
import AppError from "../services/AppError";
import { CabinReviewController } from "./CabinsReviewController";
import { UploadFiles } from "../decorators/UploadFilesDecorator";

interface MulterRequest extends Request {
  files?: Express.Multer.File[]; // Multiple files
}

@controller("/cabins", {
  nestedRoutes: [CabinReviewController],
})
export class CabinController extends Controller<typeof CabinModel> {
  @get()
  getCabinAll() {
    const cabinController = this;
    return async function (req: Request, res: Response, next: NextFunction) {
      req.query.hotel = req.params.hotelsId;
      cabinController.getAll(CabinModel, req, res, next);
    };
  }

  // @protect()
  @get("/:id")
  getCabin() {
    return this.getOne(CabinModel);
  }

  // @protect(accounts.hotelAccount)
  // @restrictTo(Roles.admin, Roles.manager)
  @UploadFiles("albumImages")
  @post()
  createCabin() {
    return async function (
      req: MulterRequest,
      res: Response,
      next: NextFunction
    ) {
      let cabinObject = req.body;
      console.log(cabinObject);
      cabinObject.albumImages = cabinObject.albumImages
        ? cabinObject.albumImages
        : req.files?.map((file) => `/uploads/${file.filename}`);

      cabinObject = { ...cabinObject, hotel: req.params.hotelsId };
      cabinObject.amenities =
        cabinObject.amenities && !Array.isArray(cabinObject.amenities)
          ? cabinObject.amenities.split(",")
          : cabinObject.amenities;
      cabinObject.bedConfigurations =
        cabinObject.bedConfigurations &&
        !Array.isArray(cabinObject.bedConfigurations)
          ? cabinObject.bedConfigurations.split(",")
          : cabinObject.bedConfigurations;
      cabinObject.createdAt = undefined;
      cabinObject.updatedAt = undefined;
      const cabin = await CabinModel.find({
        name: req.body.name,
        hotel: req.params.hotelId,
      });

      if (cabin && cabin.length > 0) {
        return next(new AppError("The cabin name is already used.", 400));
      }

      const resourse = await CabinModel.create(cabinObject);
      res.status(201).json({ status: "success", length: 1, resourse });
    };
  }

  @del("/:id")
  deleteCabin() {
    return this.delete(CabinModel);
  }

  @UploadFiles("albumImages")
  @patch("/:id")
  updateCabin() {
    // return this.update(CabinModel);
    const cabinController = this;
    return async function (
      req: MulterRequest,
      res: Response,
      next: NextFunction
    ) {
      req.query.hotel = req.params.hotelsId;

      req.body.albumImages =
        req.files?.length === 0
          ? undefined
          : req.files?.map((file) => `/uploads/${file.filename}`);

      req.body.amenities =
        req.body.amenities && !Array.isArray(req.body.amenities)
          ? req.body.amenities.split(",")
          : req.body.amenities || [];

      req.body.bedConfigurations =
        req.body.bedConfigurations && !Array.isArray(req.body.bedConfigurations)
          ? req.body.bedConfigurations.split(",")
          : req.body.bedConfigurations || [];

      console.log(req.body);
      cabinController.update(CabinModel, req, res, next);
    };
  }
}
