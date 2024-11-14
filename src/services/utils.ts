import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import { BookingModel } from "../models/bookingModel";
import AppError from "./AppError";

export async function compPasswords(
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

export async function hashPassword(this: any, next: Function) {
  if (!(this as any).isModified("password")) {
    return next();
  }
  this.confirmPassword = undefined;
  this.password = await bcrypt.hash(this.password, 12);
  next();
}

export function createPasswordResetHash() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  return { resetToken, resetTokenHash };
}

export function compResetToken(
  candidateRestToken: string,
  restTokenHash: string
) {
  const candidateRestTokenHash = crypto
    .createHash("sha256")
    .update(candidateRestToken)
    .digest("hex");
  return restTokenHash === candidateRestTokenHash;
}

export function StripeWebhook() {
  return async function (req: Request, res: Response, next: NextFunction) {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    let event;

    try {
      console.log("sig", sig);
      console.log("webhookSecret", webhookSecret);
      if (!sig) return next(new AppError("Webhook signature not found", 400));
      event = Stripe.webhooks.constructEvent(req.body, sig!, webhookSecret);
    } catch (err) {
      console.log("Webhook signature verification failed", err);
      return res.status(400).send(`Webhook Error: ${err}`);
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata.bookingId;

        const booking = await BookingModel.findById(bookingId);

        if (!booking) return next(new AppError("Booking not found", 404));

        booking.paymentStatus = "paid";
        await booking.save();

        break;

      case "payment_intent.payment_failed":
        const paymentFailed = event.data.object;
        console.log("Payment failed:", paymentFailed);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send({
      status: "success",
    });
  };
}
