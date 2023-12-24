import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { accounts } from "./accounts";
import { HotelAccountModel } from "../models/hotelAccount";
import { GuestModel } from "../models/guestModel";
import AppError from "../services/AppError";
import { RolesModel } from "../models/rolesModel";

type RequestM = Request & { user?: any };

export function protectFunc(protect: string) {
  return async function (req: RequestM, res: Response, next: NextFunction) {
    try {
      const token = (req.headers.authorization as string)?.split(" ")[1];
      console.log(token);

      if (!token) {
        return next(
          new AppError(
            "You must be logged in to access this feature. Please log in or create an account to continue.",
            401
          )
        );
      }

      const decode: any = jwt.verify(token, process.env.JWT_SECRET!);

      if (!decode) {
        return next(
          new AppError(
            "Invalid token. Please log in or create an account to continue.",
            401
          )
        );
      }

      if (protect !== accounts.all && decode.type !== protect) {
        return next(
          new AppError(
            `You are not a valid candidate for this operation. This is reservered to: ${protect}. Please create a ${protect} to continue.`,
            401
          )
        );
      }

      const model: any =
        decode.type === "HotelAccount" ? HotelAccountModel : GuestModel;

      const user = await model.findById(decode.id).select("+passwordChangeAt");

      if (!user) {
        return next(
          new AppError(
            "Your account was Deleted a few time ago. Please create an account to continue.",
            401
          )
        );
      }

      const passwordChageAt = +new Date(user.passwordChangeAt).getTime() / 1000;
      const tokenIssuedAt = +new Date(decode.iat).getTime();

      if (passwordChageAt > tokenIssuedAt) {
        return next(
          new AppError(
            "You have changed your password recently. Please log in to continue.",
            401
          )
        );
      }

      req.user = user;

      next();
    } catch (err) {
      next(err);
    }
  };
}

export function restrictToFunc(restrictTo: string[]) {
  return async function (req: RequestM, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(
          new AppError(
            "You must be logged in to access this feature. Please log in or create an account to continue.",
            401
          )
        );
      }

      const userId = req.user?.id;

      const hotelId = req.params.hotelId;

      const candidateRole = await RolesModel.findOne({
        hotelAccount: userId,
        hotel: hotelId,
      });

      const isAuthorize = restrictTo.some(
        (role: string) => candidateRole?.role === role
      );

      if (!candidateRole || !isAuthorize) {
        return next(
          new AppError("You are not authorized to access this feature.", 403)
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
