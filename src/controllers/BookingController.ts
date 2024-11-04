import { ObjectId } from "mongodb";
import { NextFunction, Request, Response, Router } from "express";
import { controller } from "../decorators/controllerDecorator";
import { del, get, patch, post } from "../decorators/routeHandlerDecorators";
import { BookingModel } from "../models/bookingModel";
import { Controller } from "../services/Controllers";

@controller("/bookings")
export class BookingController extends Controller<typeof BookingModel> {
  @get()
  getBookingAll() {
    const CabinController = this;
    return async function (req: Request, res: Response, next: NextFunction) {
      req.query.hotel = req.params.hotelsId;
      CabinController.getAll(BookingModel, req, res, next);
    };
  }

  @get("/todaysActivityBookings")
  GetTodaysActivityBooking() {
    return async function (req: Request, res: Response, next: NextFunction) {
      const hotelId = req.params.hotelsId;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaysBookingsArriving = await BookingModel.aggregate([
        {
          $match: {
            hotel: new ObjectId(hotelId),
            status: "unconfirmed",
            checkInDate: {
              $gte: today,
              $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $lookup: {
            from: "guests",
            localField: "guest",
            foreignField: "_id",
            as: "guest",
          },
        },
        { $unwind: "$guest" },
        {
          $addFields: {
            numNights: {
              $divide: [
                { $subtract: ["$checkOutDate", "$checkInDate"] },
                1000 * 60 * 60 * 24,
              ],
            },
          },
        },
      ]);

      const todaysBookingsDeparting = await BookingModel.aggregate([
        {
          $match: {
            hotel: new ObjectId(hotelId),
            status: "checkedin",
            checkOutDate: {
              $gte: today,
              $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $lookup: {
            from: "guests",
            localField: "guest",
            foreignField: "_id",
            as: "guest",
          },
        },
        { $unwind: "$guest" },
        {
          $addFields: {
            numNights: {
              $divide: [
                { $subtract: ["$checkOutDate", "$checkInDate"] },
                1000 * 60 * 60 * 24,
              ],
            },
          },
        },
      ]);

      const todaysBookings = [
        ...todaysBookingsArriving,
        ...todaysBookingsDeparting,
      ];

      res.status(200).json({
        status: "success",
        length: todaysBookings.length,
        todaysBookings,
      });
    };
  }

  @get("/:id")
  getBooking() {
    return this.getOne(BookingModel);
  }

  @get("/checkin")
  checkin() {
    const CabinController = this;
    return async function (req: Request, res: Response, next: NextFunction) {
      req.query.hotel = req.params.hotelsId;
      CabinController.getAll(BookingModel, req, res, next);
    };
  }

  @post()
  createBooking() {
    return this.create(BookingModel);
  }

  @del("/:id")
  deleteBooking() {
    return this.delete(BookingModel);
  }

  @patch("/:id")
  updateBooking() {
    return this.update(BookingModel);
  }

  @get("/q/:q")
  searchBookingByGuestName() {
    const CabinController = this;
    return async function (req: Request, res: Response, next: NextFunction) {
      const q = req.params.q;
      const matchConditions: any = {};

      const sortBy = (req.query.sort as string)?.split(",").join(" ");

      if (req.query.status) {
        matchConditions.status = req.query.status;
      }

      const query = BookingModel.aggregate([
        {
          $lookup: {
            from: "guests",
            localField: "guest",
            foreignField: "_id",
            as: "guest",
          },
        },
        {
          $lookup: {
            from: "cabins",
            localField: "cabin",
            foreignField: "_id",
            as: "cabin",
          },
        },
        {
          $unwind: "$guest",
        },
        {
          $unwind: "$cabin",
        },
        {
          $match: {
            "guest.fullName": { $regex: q, $options: "i" },
          },
        },
        {
          $addFields: {
            numNights: {
              $ceil: [
                {
                  $divide: [
                    { $subtract: ["$checkOutDate", "$checkInDate"] }, // Subtract the dates (in milliseconds)
                    1000 * 60 * 60 * 24, // Convert milliseconds to days
                  ],
                },
              ],
            },
          },
        },
        {
          $match: {
            ...matchConditions,
          },
        },
        {
          $project: {
            _id: 1,
            checkInDate: 1,
            checkOutDate: 1,
            cabinPrice: 1,
            extrasPrice: 1,
            totalPrice: 1,
            status: 1,
            hasBreakfast: 1,
            paymentStatus: 1,
            numNights: 1,
            createdAt: 1,
            "cabin.name": 1,
            "guest.fullName": 1,
            "guest.email": 1,
            "guest.nationalID": 1,
            total_count: 1,
          },
        },
      ]);

      const queryCount = BookingModel.aggregate([
        {
          $lookup: {
            from: "guests",
            localField: "guest",
            foreignField: "_id",
            as: "guest",
          },
        },

        {
          $unwind: "$guest",
        },
        {
          $match: {
            "guest.fullName": { $regex: q, $options: "i" },
          },
        },
        {
          $match: {
            ...matchConditions,
          },
        },
        {
          $count: "total_count",
        },
      ]);

      const totalItems = await queryCount;

      if (sortBy) {
        query.sort(sortBy);
      }

      const page = req.query.page ? +req.query.page : 1;
      const limit = req.query.limit ? +req.query.limit : 3;
      const skip = (page - 1) * limit;

      query.skip(skip).limit(limit);

      const resourses = await query;

      res.status(200).json({
        status: "success",
        length: resourses.length,
        totalItems: totalItems[0]?.total_count || 0,
        resourses,
      });
    };
  }
}
