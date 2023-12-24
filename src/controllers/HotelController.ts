import { NextFunction, Request, Response } from "express";
import stripe from "stripe";

import { controller } from "../decorators/controllerDecorator";
import { del, get, patch, post } from "../decorators/routeHandlerDecorators";
import { protect } from "../decorators/authDecorators";
import { HotelModel } from "../models/hotelModel";
import { Controller } from "../services/Controllers";
import { BookingModel, Booking } from "../models/bookingModel";
import { CabinModel, Cabin } from "../models/cabinModel";
import { nestedRoute } from "../decorators/nestedRouteDecorator";
import { CabinController } from "./CabinControllers";
import AppError from "../services/AppError";
import { RolesModel, Roles } from "../models/rolesModel";
import { accounts } from "../decorators/accounts";

type RequestM = Request & { user?: any };

@controller("/hotels")
@nestedRoute("/:hotelId", CabinController.getRouter())
export class HotelsController extends Controller<typeof HotelModel> {
  // func
  @get()
  getHotelAll() {
    console.log(this);
    return this.getAll(HotelModel);
  }

  @get("/q")
  searchHotels() {
    return async function (req: Request, res: Response, next: NextFunction) {
      const { city, country, state, checkinDate, checkoutDate, numGuests } =
        req.query;
      const bookings = await BookingModel.find({
        $or: [
          {
            checkInDate: { $lte: new Date(checkinDate as string) },
            checkOutDate: { $gte: new Date(checkinDate as string) },
          },
          {
            checkInDate: { $lte: new Date(checkoutDate as string) },
            checkOutDate: { $gte: new Date(checkoutDate as string) },
          },
        ],
      });
      const reserverdCabinId = bookings.map((book: Booking) => book.cabin);

      const availableCabins =
        (await CabinModel.find({
          _id: { $nin: reserverdCabinId },
          maxCapacity: { $gte: numGuests },
        })) || [];

      // console.log(availableCabins);

      const availableHotelId = availableCabins.map(
        (cabin: Cabin) => cabin.hotel
      );
      // console.log(availableHotelId);

      const hotels = await HotelModel.find({
        _id: { $in: availableHotelId },
        "location.city": city,
        "location.state": state,
        "location.country": country,
      });

      res
        .status(200)
        .json({ status: "success", length: hotels.length, hotels });
    };
  }

  @get("/:id")
  getHotel() {
    return this.getOne(HotelModel);
  }

  @get("/cabinStats/:id")
  getHotelAndCabinStats() {
    return async function (req: Request, res: Response, next: NextFunction) {
      // 1 find the hotel by id
      const id = req.params.id;
      const { checkinDate, checkoutDate } = req.query;

      const hotel = await HotelModel.findById(id);

      // check if the cabin is available
      if (!hotel) return;

      // find the cabins not reserved in the hotel with the given date
      const bookings = await BookingModel.find({
        hotel: hotel._id,
        $or: [
          {
            checkInDate: { $lte: new Date(checkinDate as string) },
            checkOutDate: { $gte: new Date(checkinDate as string) },
          },
          {
            checkInDate: { $lte: new Date(checkoutDate as string) },
            checkOutDate: { $gte: new Date(checkoutDate as string) },
          },
        ],
      });
      const reserverdCabinId = bookings.map((book: Booking) => book.cabin);

      // 2. process the cabins data in the hotel and return the stats
      const cabins = await CabinModel.aggregate([
        { $match: { hotel: hotel._id } },
        {
          $group: {
            _id: "$cabinType",
            numCabins: { $sum: 1 },
            numCabinsAvailable: {
              $sum: { $cond: [{ $in: ["$_id", reserverdCabinId] }, 0, 1] },
            },
            maxCapacity: { $avg: "$maxCapacity" },
            images: { $first: "$images" },
            regularPrice: { $avg: "$regularPrice" },
            discount: { $avg: "$discount" },
            amenities: { $first: "$amenities" },
            availableCabins: {
              $push: {
                $cond: [{ $in: ["$_id", reserverdCabinId] }, null, "$_id"],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            cabinType: "$_id",
            amenities: 1,
            numCabins: 1,
            numCabinsAvailable: 1,
            maxCapacity: 1,
            images: 1,
            regularPrice: 1,
            discount: 1,
            availableCabins: {
              $filter: {
                input: "$availableCabins",
                as: "availableCabin",
                cond: { $ne: ["$$availableCabin", null] },
              },
            },
          },
        },
      ]);

      res.status(200).json({ hotel, cabins });
    };
  }
  @protect(accounts.hotelAccount)
  @post()
  createHotel() {
    return async function (req: RequestM, res: Response) {
      const resourse = await HotelModel.create({
        ...req.body,
        hotelAccount: req.user._id,
      });
      const stripeApi = new stripe(process.env.STRIPE_SECRET_KEY as string);

      await RolesModel.create({
        role: Roles.admin,
        hotel: resourse._id,
        hotelAccount: resourse.hotelAccount,
      });

      const account = await stripeApi.accounts.create({
        type: "express",
        capabilities: {
          card_payments: {
            requested: true,
          },
          transfers: {
            requested: true,
          },
        },
      });
      resourse.stripeAccountId = account.id;

      await resourse.save();

      res.status(201).json({ status: "success", length: 1, resourse, account });
    };
  }

  @get("/stripeLink/:id")
  getStripeLink() {
    return async function (req: Request, res: Response, next: NextFunction) {
      const hotel = await HotelModel.findById(req.params.id);
      if (!hotel) return next(new AppError("Hotel not found", 404));
      const stripeApi = new stripe(process.env.STRIPE_SECRET_KEY as string);
      const accountLink = await stripeApi.accountLinks.create({
        account: hotel.stripeAccountId,
        refresh_url: "http://localhost:8000/hotels",
        return_url: "http://localhost:8000/hotels",
        type: "account_onboarding",
      });
      res.status(200).json({ status: "success", accountLink });
    };
  }

  @del("/:id")
  deleteHotel() {
    return this.delete(HotelModel);
  }

  @patch("/:id")
  updateHotel() {
    return this.update(HotelModel);
  }
}
