import { ObjectId } from "mongodb";
import { NextFunction, Request, Response } from "express";
import { controller } from "../decorators/controller";
import { del, get, patch, post } from "../decorators/routeHandles";
import { HotelModel } from "../models/hotelModel";
import { ApiFeatures } from "../services/ApiFeatures";
import { Controller } from "../services/Controllers";
import { BookingModel, Booking } from "../models/bookingModel";
import mongoose from "mongoose";
import { CabinModel, Cabin } from "../models/cabinModel";

@controller("/hotels")
export class HotelsController extends Controller<typeof HotelModel> {
  @get()
  getHotelAll() {
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
      // console.log(reserverdCabinId);
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

  @post()
  createHotel() {
    return this.create(HotelModel);
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
