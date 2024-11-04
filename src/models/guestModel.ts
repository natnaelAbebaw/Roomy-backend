import mongoose from "mongoose";
import validator from "validator";
import {
  compPasswords,
  hashPassword,
  createPasswordResetHash,
  compResetToken,
} from "../services/utils";

export interface Guest extends Document {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  nationality: string;
  nationalID: string;
  avatarUrl: string;
  confirmPassword: string | undefined;
  address: {
    city?: string;
    country?: string;
  };
  compPasswords(password: string): boolean;
  passwordChangeAt: Date;
  passwordResetToken: String;
  passwordResetTokenExpiresAt: Date;
  compPasswords(password: string): boolean;
  compResetToken(candidateResetToken: string, resetTokenHash: string): boolean;
  createPasswordResetHash(): { resetToken: string; resetTokenHash: string };
  active: Boolean;
}

const guestSchema = new mongoose.Schema<Guest>(
  {
    fullName: { type: String, required: true },
    userName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "invalid email"],
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
        validator: function (this: Guest, val: string) {
          return val === this.password;
        },
        message: "passwords are not the same",
      },
    },
    nationality: { type: String, required: true },
    nationalID: { type: String, required: true },
    avatarUrl: { type: String },
    passwordChangeAt: {
      type: Date,
      required: true,
      default: Date.now(),
      select: false,
    },
    address: {
      city: { type: String },
      country: { type: String },
    },
    passwordResetToken: String,
    passwordResetTokenExpiresAt: Date,
    active: { type: Boolean, default: true, select: false },
  },
  { timestamps: true }
);

guestSchema.pre("save", hashPassword);
guestSchema.pre(/^find/, function (this: any) {
  this.find({ active: true });
});

guestSchema.methods.compPasswords = compPasswords;

guestSchema.methods.createPasswordResetHash = createPasswordResetHash;
guestSchema.methods.compResetToken = compResetToken;

export const GuestModel = mongoose.model<Guest>("Guest", guestSchema);
