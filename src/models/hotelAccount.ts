import mongoose, { Document } from "mongoose";
import validator from "validator";
import {
  compPasswords,
  compResetToken,
  createPasswordResetHash,
  hashPassword,
} from "../services/utils";
export interface HotelAccount extends Document {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string | undefined;
  passwordChangeAt: Date;
  passwordResetToken: string | undefined;
  passwordResetTokenExpiresAt: Date | undefined;
  compPasswords(password: string): boolean;
  compResetToken(candidateResetToken: string, resetTokenHash: string): boolean;
  createPasswordResetHash(): { resetToken: string; resetTokenHash: string };
  active: Boolean;
}

const HotelAccountSchema = new mongoose.Schema<HotelAccount>(
  {
    userName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "invalid email"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "password must be at least 8 characters"],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: true,
      validate: {
        validator: function (this: HotelAccount, val: string) {
          return val === this.password;
        },
        message: "passwords are not the same",
      },
    },

    passwordChangeAt: {
      type: Date,
      required: true,
      default: Date.now(),
      select: false,
    },
    passwordResetToken: String,
    passwordResetTokenExpiresAt: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

HotelAccountSchema.pre("save", hashPassword);
HotelAccountSchema.pre(/^find/, function (this: any) {
  this.find({ active: true });
});

HotelAccountSchema.methods.compPasswords = compPasswords;

HotelAccountSchema.methods.createPasswordResetHash = createPasswordResetHash;

HotelAccountSchema.methods.compResetToken = compResetToken;

export const HotelAccountModel = mongoose.model<HotelAccount>(
  "HotelAccount",
  HotelAccountSchema
);
