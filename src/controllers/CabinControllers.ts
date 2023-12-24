import { NextFunction, Request, Response } from "express";
import { controller } from "../decorators/controllerDecorator";
import { del, get, patch, post } from "../decorators/routeHandlerDecorators";
import { protect, restrictTo } from "../decorators/authDecorators";
import { Roles } from "../models/rolesModel";
import { CabinModel } from "../models/cabinModel";
import { ApiFeatures } from "../services/ApiFeatures";
import { Controller } from "../services/Controllers";
import { accounts } from "../decorators/accounts";
import AppError from "../services/AppError";

@controller("/cabins")
export class CabinController extends Controller<typeof CabinModel> {
  @protect()
  @get()
  getCabinAll() {
    return async function (req: Request, res: Response, next: NextFunction) {
      const hotelQuery = req.params.hotelId
        ? { hotel: req.params.hotelId }
        : {};
      const apiFeature = new ApiFeatures(CabinModel, req.query);
      const err = await apiFeature
        .applyFilter()
        .applySort()
        .applyFields()
        .applyPagnation()
        .catch((err) => err);
      if (err) return next(err);
      const resourses = await apiFeature.query.where(hotelQuery);
      res
        .status(200)
        .json({ status: "success", length: resourses.length, resourses });
    };
  }

  @protect()
  @get("/:id")
  getCabin() {
    return this.getOne(CabinModel);
  }

  @protect(accounts.hotelAccount)
  @restrictTo(Roles.admin, Roles.manager)
  @post()
  createCabin() {
    return async function (req: Request, res: Response, next: NextFunction) {
      let cabinObject = req.body;
      if (req.params.hotelId)
        cabinObject = { ...cabinObject, hotel: req.params.hotelId };

      // duplicated cabin name
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

  @patch("/:id")
  updateCabin() {
    return this.update(CabinModel);
  }
}
