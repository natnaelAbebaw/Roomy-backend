import { Model, Document } from "mongoose";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../services/AppError";
import { Controller } from "../services/Controllers";
import { sendEmail } from "../services/sendEmail";

type MongooseModel<T extends Document> = Model<T, {}>;

type RequestM = Request & { user: any };

export class AuthController<
  T extends MongooseModel<any>
> extends Controller<T> {
  private tokenize(id: string, type: string) {
    return jwt.sign({ id, type }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRE_DATE,
    });
  }

  signup(model: T) {
    const controller = this;
    return async function (req: Request, res: Response, next: NextFunction) {
      const user = await model.create(req.body);
      const type = user.constructor.modelName;
      const token = controller.tokenize(user._id, type);
      res.status(201).json({ status: "success", user, token });
    };
  }

  login(model: T) {
    const controller = this;
    return async function (req: Request, res: Response, next: NextFunction) {
      const { email, password } = req.body;

      if (!email || !password)
        return next(new AppError("Please provide email and password", 400));

      const user: any = await model
        .findOne({
          email,
        })
        .select("+password");

      const isPasswordCorrect = await user?.compPasswords(
        password,
        user?.password
      );

      if (!user || !isPasswordCorrect) {
        return next(new AppError("Incorrect user or password.", 400));
      }
      const type = user.constructor.modelName;
      const token = controller.tokenize(user._id, type);

      res.status(200).json({ status: "success", user, token });
    };
  }

  updateUserInfo(model: T) {
    return async function (req: RequestM, res: Response, next: NextFunction) {
      const data = req.body;

      data.password = undefined;
      data.confirmPassword = undefined;

      const updatedUser = await model.findByIdAndUpdate(req.user.id, data, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({ status: "success", updatedUser });
    };
  }

  updatePassword(model: T) {
    return async function (req: RequestM, res: Response, next: NextFunction) {
      const user: any = await model.findById(req.user.id).select("+password");
      const { password, newPassword, confirmNewPassword } = req.body;

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      if (!(await user.compPasswords(password, user.password))) {
        return next(new AppError("Incorrect password", 400));
      }

      user.password = newPassword;
      user.confirmPassword = confirmNewPassword;
      user.passwordChangeAt = Date.now();
      const updatedUser = await user.save();

      res.status(200).json({ status: "success", updatedUser });
    };
  }

  // forgot password
  forgetPassword(model: T) {
    return async function (req: Request, res: Response, next: NextFunction) {
      // find user by email

      const user: any = await model.findOne({ email: req.body.email });

      // if not user return error
      if (!user) {
        return next(new AppError("There is no user found by this Email", 404));
      }

      // generate random token with crypto module
      const { resetToken, resetTokenHash } = user.createPasswordResetHash();
      // save token to user document
      console.log(resetToken, resetTokenHash);
      user.passwordResetToken = resetTokenHash;
      const expireTime = process.env.RESET_PASSWORD_EXPIRE_TIME;

      user.passwordResetTokenExpiresAt = new Date(
        Date.now() + Number(expireTime)
      );

      await user.save({ validateBeforeSave: false });
      // send token to user email

      const subject = `Subject: Password Reset Request(${
        Number(expireTime) / 60000
      }mins)`;
      const type = user.constructor.modelName;
      const resetUrl = `${req.protocol}/${req.get("host")}/${
        type === "Guest" ? "guests" : "hotelAccounts"
      }/${user.id}/resetPassword/${resetToken}`;
      const message = `
      <div>
      <p>Hello ${user.userName}, 
      </br>
      We received a request to reset the password for your account. If you did not make this request, you can ignore this email.
       </br>
      To reset your password, please click on the following link: </br>
      
      <a href="${resetUrl}">${resetUrl}</a>
      </br>
      This link will expire in ${
        Number(expireTime) / 60000
      } mins, so please reset your password as soon as possible.
      </br>
      If you're having trouble clicking the link, you can copy and paste it into your browser.
      </br>
      Thank you,
      </br>
      hotelBooking.com
      </p></div>`;
      try {
        await sendEmail(user.email, subject, message);
        res.status(200).json({
          status: "success",
          message: "Reset password link is send to your email.",
        });
      } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiresAt = undefined;
        await user.save();
        next(new AppError("There is an error on sending email", 500));
      }
    };
  }

  resetPassword(model: T) {
    return async function (req: Request, res: Response, next: NextFunction) {
      const id = req.params.userId;
      const token = req.params.token;
      const { newPassword, confirmNewPassword } = req.body;

      const user: any = await model.findById(id);

      if (!user) {
        return next(new AppError("User not found", 404));
      }
      console.log(token, user.passwordResetToken);
      const isCorrectToken = user.compResetToken(
        token,
        user.passwordResetToken
      );

      if (!isCorrectToken) {
        return next(new AppError("Invalid password reset token.", 400));
      }

      if (user.passwordResetTokenExpiresAt < Date.now()) {
        return next(
          new AppError(
            "Password reset token expire. please get another token.",
            400
          )
        );
      }

      user.password = newPassword;
      user.confirmPassword = confirmNewPassword;
      user.passwordChangeAt = Date.now();
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiresAt = undefined;

      const updatedUser = await user.save();

      res.status(200).json({ status: "success", user: updatedUser });
    };
  }

  // delete me
  deleteMe(model: T) {
    return async function (req: RequestM, res: Response, next: NextFunction) {
      await model.findByIdAndDelete(req.user.id, { active: false });

      res.status(204).json({ status: "success", user: null });
    };
  }
}
