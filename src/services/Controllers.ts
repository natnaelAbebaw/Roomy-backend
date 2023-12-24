import { NextFunction, Request, Response, Router } from "express";
import AppError from "../services/AppError";
import { ApiFeatures } from "../services/ApiFeatures";
import { Model } from "mongoose";
type MongooseModel<T extends Document> = Model<T, {}>;

export class Controller<T extends MongooseModel<any>> {
  public static router: Router;

  static getRouter() {
    if (!Controller.router) {
      Controller.router = Router({ mergeParams: true });
    }
    return Controller.router;
  }

  async getAll(model: T) {
    return async function (req: Request, res: Response, next: NextFunction) {
      const apiFeature = new ApiFeatures(model, req.query);
      const err = await apiFeature
        .applyFilter()
        .applySort()
        .applyFields()
        .applyPagnation()
        .catch((err) => err);
      if (err) return next(err);
      const resourses = await apiFeature.query;
      res
        .status(200)
        .json({ status: "success", length: resourses.length, resourses });
    };
  }

  async getOne(model: T) {
    return async function (req: Request, res: Response, next: NextFunction) {
      const id = req.params.id;
      const resourse = await model.findOne({ _id: id });
      if (!resourse) return next(new AppError("Resourse not found.", 404));
      res.status(200).json({ status: "success", length: 1, resourse });
    };
  }

  async create(model: T) {
    return async function (req: Request, res: Response) {
      const resourse = await model.create(req.body);
      res.status(201).json({ status: "success", length: 1, resourse });
    };
  }

  async delete(model: T) {
    return async function (req: Request, res: Response, next: NextFunction) {
      const resourse = await model.findByIdAndDelete(req.params.id);
      if (!resourse) return next(new AppError("resourse not found", 404));
      res.status(204).json({ status: "success" });
    };
  }

  async update(model: T) {
    return async function (req: Request, res: Response, next: NextFunction) {
      const resourse = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!resourse) return next(new AppError("resourse not found", 404));
      res.status(200).json({ status: "success", length: 1, resourse });
    };
  }
}
