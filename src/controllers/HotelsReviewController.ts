import { HotelReviewModel } from "../models/hotelReviewModel";
import { controller } from "../decorators/controllerDecorator";
import { del, get, patch, post } from "../decorators/routeHandlerDecorators";
import { protect } from "../decorators/authDecorators";
import { Controller } from "../services/Controllers";
import { NextFunction, Request, Response, Router } from "express";
import { ObjectId } from "mongodb";

@controller("/hotelReviews")
export class HotelReviewController extends Controller<typeof HotelReviewModel> {
  // @protect()
  @get()
  getAllhotelReviews() {
    const hotelReviewController = this;
    return async function (req: Request, res: Response, next: NextFunction) {
      req.query.hotel = req.params.hotelsId;
      return hotelReviewController.getAll(HotelReviewModel, req, res, next);
    };
  }

  // @protect()

  // @protect()
  @post()
  createhotelReview() {
    const hotelReviewController = this;
    return async function (
      req: Request & { user: any },
      res: Response,
      next: NextFunction
    ) {
      if (!req.body.hotel) req.body.hotel = req.params.hotelsId;
      if (!req.body.guest) req.body.guest = req.user.id;
      return hotelReviewController.create(HotelReviewModel, req, res, next);
    };
  }

  @get("/hotelReviewStat")
  hotelReviewStat() {
    return async function (
      req: Request & { user: any },
      res: Response,
      next: NextFunction
    ) {
      const id = req.params.hotelsId;

      const hotelReview = await HotelReviewModel.aggregate([
        { $match: { hotel: new ObjectId(id) } },
        {
          $group: {
            _id: "$hotel",
            "comfort and cleanliness": {
              $avg: "$rates.comfort and cleanliness",
            },
            "facilities and aminities": {
              $avg: "$rates.facilities and aminities",
            },
            "Overall Experience": { $avg: "$rates.Overall Experience" },
            "services and staff": { $avg: "$rates.services and staff" },
            location: { $avg: "$rates.location" },
            "value for Money": { $avg: "$rates.value for Money" },
            totalReviews: { $sum: 1 },
          },
        },
        {
          $project: {
            rates: {
              "comfort and cleanliness": "$comfort and cleanliness",
              "facilities and aminities": "$facilities and aminities",
              "Overall Experience": "$Overall Experience",
              "services and staff": "$services and staff",
              location: "$location",
              "value for Money": "$value for Money",
            },

            totalReviews: 1,
          },
        },
      ]);

      res.status(200).json({ hotelReview: hotelReview[0] });
    };
  }

  @get("/hotelReviewRateRangeStat")
  async hotelReviewRateRangeStat() {
    return async function (
      req: Request & { user: any },
      res: Response,
      next: NextFunction
    ) {
      const id = req.params.hotelsId;
      const RateRanges = await HotelReviewModel.aggregate([
        {
          $match: {
            hotel: new ObjectId(id),
          },
        },
        {
          $project: {
            averageRate: {
              $avg: [
                "$rates.Overall Experience",
                "$rates.comfort and cleanliness",
                "$rates.facilities and aminities",
                "$rates.Overall Experience",
                "$rates.services and staff",
                "$rates.location",
                "$rates.value for Money",
              ],
            },
          },
        },
        {
          $bucket: {
            groupBy: "$averageRate",
            boundaries: [1, 2, 3, 4, 5],
            default: "Other",
            output: {
              count: { $sum: 1 },
            },
          },
        },
      ]);

      res.status(200).json({ RateRanges });
    };
  }
  @get("/:id")
  gethotelReview() {
    return this.getOne(HotelReviewModel);
  }
  // @protect()/
  @del("/:id")
  deletehotelReview() {
    return this.delete(HotelReviewModel);
  }

  // @protect()
  @patch("/:id")
  updatehotelReview() {
    return this.update(HotelReviewModel);
  }
}
