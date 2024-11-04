import { NextFunction, Request, Response, Router } from "express";
import AppError from "./AppError";
import { ApiFeatures } from "./ApiFeatures";
import { Model } from "mongoose";
type MongooseModel<T extends Document> = Model<T, {}>;

export class Controller<T extends MongooseModel<any>> {
  _getAll(model: T) {
    return async function (req: Request, res: Response, next: NextFunction) {
      console.log(req.query);
      const apiFeature = new ApiFeatures(model, req.query);
      const err = await apiFeature
        .applyFilter()
        .applySearch()
        .applySort()
        .applyFields()
        .applyPagnation()
        .catch((err) => err);
      if (err) return next(err);
      const resourses = await apiFeature.query;

      let filterQuerys = { ...req.query };
      const excludedFields = ["page", "limit", "fields", "sort", "q"];
      excludedFields.forEach((field) => delete filterQuerys[field]);
      filterQuerys = JSON.parse(
        JSON.stringify(filterQuerys).replace(
          /\b(gte|gt|lte|lt|in|all)\b/g,
          (match) => `$${match}`
        )
      );

      const searchQuery =
        req.query.q && typeof req.query.q == "string"
          ? { $text: { $search: req.query.q } }
          : {};

      // console.log(filterQuerys);
      const totalItems = await model.countDocuments({
        ...filterQuerys,
        ...searchQuery,
      });

      // console.log(totalItems);
      // const ids = resourses.map((a: any) => a._id);

      res.status(200).json({
        status: "success",
        length: resourses.length,
        totalItems,
        resourses,
      });
    };
  }
  _getOne(model: T) {
    return async function (req: Request, res: Response, next: NextFunction) {
      const id = req.params.id;
      const resourse = await model.findOne({ _id: id });
      if (!resourse) return next(new AppError("Resourse not found.", 404));
      res.status(200).json({ status: "success", length: 1, resourse });
    };
  }

  _create(model: T) {
    return async function (req: Request, res: Response, next: NextFunction) {
      const resourse = await model.create(req.body);
      res.status(201).json({ status: "success", length: 1, resourse });
    };
  }
  _delete(model: T) {
    return async function (req: Request, res: Response, next: NextFunction) {
      const resourse = await model.findByIdAndDelete(req.params.id);
      if (!resourse) return next(new AppError("resourse not found", 404));
      res.status(204).json({ status: "success" });
    };
  }

  _update(model: T) {
    return async function (req: Request, res: Response, next: NextFunction) {
      const resourse = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!resourse) return next(new AppError("resourse not found", 404));
      res.status(200).json({ status: "success", length: 1, resourse });
    };
  }

  // _search(model: T) {
  //   return async function (req: Request, res: Response, next: NextFunction) {
  //     const resourse = await model.find(req.body);
  //   };
  // }

  async getAll(model: T, req?: Request, res?: Response, next?: NextFunction) {
    return req && res && next
      ? this._getAll(model)(req, res, next)
      : this._getAll(model);
  }

  async getOne(model: T, req?: Request, res?: Response, next?: NextFunction) {
    return req && res && next
      ? this._getOne(model)(req, res, next)
      : this._getOne(model);
  }

  async create(model: T, req?: Request, res?: Response, next?: NextFunction) {
    return req && res && next
      ? this._create(model)(req, res, next)
      : this._create(model);
  }

  async delete(model: T, req?: Request, res?: Response, next?: NextFunction) {
    return req && res && next
      ? this._delete(model)(req, res, next)
      : this._delete(model);
  }

  async update(model: T, req?: Request, res?: Response, next?: NextFunction) {
    return req && res && next
      ? this._update(model)(req, res, next)
      : this._update(model);
  }

  // async search(model: T, req?: Request, res?: Response, next?: NextFunction) {
  //   return req && res && next
  //     ? this._search(model)(req, res, next)
  //     : this._search(model);
  // }
}
