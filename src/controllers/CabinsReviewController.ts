import { CabinReviewModel } from "../models/cabinReviewModel";
import { controller } from "../decorators/controllerDecorator";
import { del, get, patch, post } from "../decorators/routeHandlerDecorators";
import { protect } from "../decorators/authDecorators";
import { Controller } from "../services/Controllers";
import { NextFunction, Request, Response, Router } from "express";

@controller("/CabinReviews")
export class CabinReviewController extends Controller<typeof CabinReviewModel> {
  @protect()
  @get()
  getAllCabinReviews() {
    const CabinReviewController = this;
    return async function (req: Request, res: Response, next: NextFunction) {
      req.query.cabin = req.params.cabinsId;
      return CabinReviewController.getAll(CabinReviewModel, req, res, next);
    };
  }

  @protect()
  @get("/:id")
  getCabinReview() {
    return this.getOne(CabinReviewModel);
  }

  @protect()
  @post()
  createCabinReview() {
    const CabinReviewController = this;
    return async function (
      req: Request & { user: any },
      res: Response,
      next: NextFunction
    ) {
      if (!req.body.cabin) req.body.cabin = req.params.cabinsId;
      if (!req.body.guest) req.body.guest = req.user.id;
      return CabinReviewController.create(CabinReviewModel, req, res, next);
    };
  }

  @protect()
  @del("/:id")
  deleteCabinReview() {
    return this.delete(CabinReviewModel);
  }

  @protect()
  @patch("/:id")
  updateCabinReview() {
    return this.update(CabinReviewModel);
  }
}
