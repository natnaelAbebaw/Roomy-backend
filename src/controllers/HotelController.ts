import { NextFunction, Request, Response } from "express";
import stripe from "stripe";

import { controller } from "../decorators/controllerDecorator";
import { del, get, patch, post } from "../decorators/routeHandlerDecorators";
import { protect } from "../decorators/authDecorators";
import { CabinTypes, HotelModel } from "../models/hotelModel";
import { Controller } from "../services/Controllers";
import { BookingModel, Booking } from "../models/bookingModel";
import { CabinModel, Cabin } from "../models/cabinModel";

import AppError from "../services/AppError";
import { RolesModel, Roles } from "../models/rolesModel";
import { accounts } from "../decorators/accounts";
import { ApiFeatures } from "../services/ApiFeatures";
import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { CabinController } from "./CabinControllers";
import { HotelReviewController } from "./HotelsReviewController";
import { BookingController } from "./BookingController";

type RequestM = Request & { user?: any };

@controller("/hotels", {
  nestedRoutes: [CabinController, HotelReviewController, BookingController],
})
export class HotelsController extends Controller<typeof HotelModel> {
  @get()
  getHotelAll() {
    return this.getAll(HotelModel);
  }

  async searchHotels(req: Request) {
    const { city, country, state, checkinDate, checkoutDate, numGuests } =
      req.query;

    let bookings: Booking[] = [];
    let filterQuery: any = {};

    if (checkinDate && checkoutDate && numGuests) {
      bookings = await BookingModel.find({
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
      let availableCabins: Cabin[] = [];

      availableCabins =
        (await CabinModel.find({
          _id: { $nin: reserverdCabinId },
          maxCapacity: { $gte: numGuests },
        })) || [];

      const availableHotelId = availableCabins.map(
        (cabin: Cabin) => cabin.hotel
      );

      filterQuery = { _id: { in: availableHotelId } };
    }

    if (city) filterQuery["location.city"] = city;
    if (state) filterQuery["location.state"] = state;
    if (country) filterQuery["location.country"] = country;

    const searchQueryString = [
      "city",
      "state",
      "country",
      "numGuests",
      "checkinDate",
      "checkoutDate",
    ];
    for (const key in req.query) {
      if (
        !searchQueryString.includes(key) &&
        req.query[key] &&
        req.query[key] !== ""
      ) {
        filterQuery[key] = req.query[key];
      }
    }

    return filterQuery;
  }

  @get("/q")
  Hotels(this: HotelsController) {
    const hotelController = this;
    return async function (req: Request, res: Response, next: NextFunction) {
      const filterQuery = await hotelController.searchHotels(req);
      for (const key in filterQuery) {
        if (filterQuery[key].all && !Array.isArray(filterQuery[key].all)) {
          filterQuery[key] = { all: filterQuery[key].all.split(",") };
        }
      }

      console.log(filterQuery);
      const apiFeature = new ApiFeatures(HotelModel, filterQuery);
      const err = await apiFeature
        .applyFilter()
        .applySort()
        .applyFields()
        .applyPagnation()
        .catch((err) => err);
      if (err) return next(err);

      const hotels = await apiFeature.query;

      res
        .status(200)
        .json({ status: "success", length: hotels.length, hotels });
    };
  }

  @get("/hotelStats")
  getHotelStats(this: HotelsController) {
    const hotelController = this;
    return async function (req: Request, res: Response, next: NextFunction) {
      let filterQuery = await hotelController.searchHotels(req);

      filterQuery = JSON.parse(
        JSON.stringify(filterQuery).replace(
          /\b(gte|gt|lte|le|in|all)\b/g,
          (match) => `$${match}`
        )
      );

      for (const key in filterQuery) {
        if (filterQuery[key].$all && !Array.isArray(filterQuery[key].$all)) {
          filterQuery[key].$all = filterQuery[key].$all.split(",");
        }
        if (filterQuery[key].$in && !Array.isArray(filterQuery[key].$in)) {
          filterQuery[key].$in = [filterQuery[key].$in];
        }
        if (
          filterQuery[key].$lte ||
          filterQuery[key].$gte ||
          filterQuery[key].$lt ||
          filterQuery[key].$gt ||
          filterQuery[key].$eq
        ) {
          for (const k in filterQuery[key]) {
            filterQuery[key][k] = Number(filterQuery[key][k]);
          }
        }
      }

      if (filterQuery._id && filterQuery._id.$in) {
        filterQuery._id.$in = filterQuery._id.$in.map(
          (id: string) => new ObjectId(id)
        );
      }

      console.log(filterQuery);
      const hotelStats = await HotelModel.aggregate([
        {
          $match: filterQuery,
        },
        {
          $count: "totalHotels",
        },
      ]);

      res
        .status(200)
        .json({ status: "success", length: 1, hotelStats: hotelStats[0] });
    };
  }

  @get("/getHotelPriceRangeStats")
  getHoteLPriceRangeStats() {
    return async function (req: Request, res: Response, next: NextFunction) {
      const { cabinTypes } = req.query;

      const minmaxPrice: { minPrice: number; maxPrice: number }[] =
        await HotelModel.aggregate([
          {
            $group: {
              _id: null,
              minPrice: { $min: "$priceRange.min" },
              maxPrice: { $max: "$priceRange.max" },
            },
          },
        ]);

      function generateBoundaries(min: number, max: number, gap: number) {
        const boundaries = [min];
        let current = min;

        while (current < max) {
          current += gap;
          boundaries.push(current);
        }

        if (boundaries[boundaries.length - 1] <= max) {
          boundaries.push(max + gap);
        }

        return boundaries;
      }

      const boundaries = generateBoundaries(
        minmaxPrice[0].minPrice,
        minmaxPrice[0].maxPrice,
        20
      );

      const priceRanges = await HotelModel.aggregate([
        {
          $match: {
            cabinTypes: {
              $in: cabinTypes ? [cabinTypes] : Object.values(CabinTypes),
            },
          },
        },
        {
          $project: {
            averagePrice: {
              $avg: ["$priceRange.min", "$priceRange.max"],
            },
          },
        },
        {
          $bucket: {
            groupBy: "$averagePrice",
            boundaries: boundaries,
            default: "Other",
            output: {
              count: { $sum: 1 },
            },
          },
        },
      ]);

      for (const i of boundaries) {
        if (!priceRanges.find((range) => range._id === i)) {
          priceRanges.push({ _id: i, count: 0 });
        }
      }

      res.status(200).json({
        status: "success",
        length: priceRanges.length,
        priceStats: {
          priceRanges: priceRanges.sort((a, b) => a._id - b._id),
          maxCount: Math.max(...priceRanges.map((range) => range.count)),
          maxPrice: minmaxPrice[0].maxPrice,
          minPrice: minmaxPrice[0].minPrice,
        },
      });
    };
  }

  @get("/:id")
  getHotel() {
    console.log("hotel id");
    return this.getOne(HotelModel);
  }

  @get("/cabinStats/:id")
  getCabinStats() {
    return async function (req: Request, res: Response, next: NextFunction) {
      const id = req.params.id;
      const { checkinDate, checkoutDate, numGuests } = req.query;
      // find  cabins not reserved in the hotel with the given date
      let reserverdCabinId: Schema.Types.ObjectId[] = [];

      if (checkinDate && checkoutDate) {
        const bookings = await BookingModel.find({
          hotel: id,
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

        reserverdCabinId = bookings.map((book: Booking) => book.cabin);
        console.log(reserverdCabinId);
      }
      // 2. process the cabins data in the hotel and return the stats
      const cabins = await CabinModel.aggregate([
        {
          $match: {
            hotel: new ObjectId(id),
            maxCapacity: { $gte: Number(numGuests || 1) },
          },
        },
        {
          $group: {
            _id: "$cabinType",
            numCabins: { $sum: 1 },
            numCabinsAvailable: {
              $sum: { $cond: [{ $in: ["$_id", reserverdCabinId] }, 0, 1] },
            },
            maxCapacity: { $avg: "$maxCapacity" },
            images: { $first: "$albumImages" },
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

      res.status(200).json({ cabins });
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

  @get("/:id/createStripeAccount")
  CreateStripeAccountForHotel() {
    return async function (req: Request, res: Response, next: NextFunction) {
      const id = req.params.id;
      const hotel = await HotelModel.findById(id);

      if (!hotel) return next(new AppError("Hotel not found", 404));

      const stripeApi = new stripe(process.env.STRIPE_SECRET_KEY as string);

      const account = await stripeApi.accounts.create({
        type: "express",
        // email: hotel.contacts.email,
        capabilities: {
          card_payments: {
            requested: true,
          },
          transfers: {
            requested: true,
          },
        },
      });

      const bankAccountToken = await stripeApi.tokens.create({
        bank_account: {
          country: "US",
          currency: "usd",
          routing_number: "110000000", // Stripe test routing number
          account_number: "000123456789", // Stripe test account number
          account_holder_name: "Test Account",
          account_holder_type: "individual",
        },
      });

      await stripeApi.accounts.createExternalAccount(account.id, {
        external_account: bankAccountToken.id,
      });

      hotel.stripeAccountId = account.id;

      await hotel.save();

      res.status(201).json({ status: "success", length: 1, hotel, account });
    };
  }

  @post("/:id/createPaymentIntent/:bookingId")
  CreatePaymentIntent() {
    return async function (req: Request, res: Response, next: NextFunction) {
      const { bookingId } = req.params;
      const hotelId = req.params.id;
      const hotel = await HotelModel.findById(hotelId);

      if (!hotel) return next(new AppError("Hotel not found", 404));

      const booking = await BookingModel.findById(bookingId);

      const guestId = booking?.guest._id;

      if (!booking) return next(new AppError("Booking not found", 404));

      const stripeApi = new stripe(process.env.STRIPE_SECRET_KEY as string);

      const paymentIntent = await stripeApi.paymentIntents.create({
        amount: Math.round(booking?.totalPrice * 100 * 0.9),
        currency: "usd",
        payment_method_types: ["card"],
        application_fee_amount: Math.round(booking?.totalPrice * 0.1 * 100),
        transfer_data: {
          destination: hotel.stripeAccountId,
        },
        metadata: {
          bookingId: booking.id,
          hotelId: hotel.id,
          guestId,
        },
      });

      res.status(201).json({
        status: "success",
        length: 1,
        resource: { clientSecret: paymentIntent.client_secret },
      });
    };
  }

  // @post("/webhook")
  // StripeWebhook() {
  //   return async function (req: Request, res: Response, next: NextFunction) {
  //     const sig = req.headers["stripe-signature"];

  //     let event;

  //     try {
  //       // Verify the webhook signature
  //       event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
  //     } catch (err) {
  //       console.log("Webhook signature verification failed", err);
  //       return res.status(400).send(`Webhook Error: ${err.message}`);
  //     }

  //     // Handle the event based on the type
  //     switch (event.type) {
  //       case "payment_intent.succeeded":
  //         const paymentIntent = event.data.object; // Contains a PaymentIntent object
  //         console.log("PaymentIntent was successful:", paymentIntent);
  //         // Update payment status in your database, send confirmation to the user, etc.
  //         break;

  //       case "payment_intent.payment_failed":
  //         const paymentFailed = event.data.object;
  //         console.log("Payment failed:", paymentFailed);
  //         // Update payment status in your database or notify the user
  //         break;

  //       // Handle other event types as necessary
  //       default:
  //         console.log(`Unhandled event type: ${event.type}`);
  //     }

  //     // Acknowledge receipt of the event
  //     res.status(200).send("Event received");
  //   };
  // }

  @del("/:id")
  deleteHotel() {
    return this.delete(HotelModel);
  }

  @patch("/:id")
  updateHotel() {
    return this.update(HotelModel);
  }
}
