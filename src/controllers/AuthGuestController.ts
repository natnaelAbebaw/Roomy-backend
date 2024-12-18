import { controller } from "../decorators/controllerDecorator";
import { protect } from "../decorators/authDecorators";
import { get, post, patch, del } from "../decorators/routeHandlerDecorators";
import { GuestModel } from "../models/guestModel";
import { AuthController } from "./AuthController";
import { Router } from "express";

@controller("/guests")
export class AuthGuestController extends AuthController<typeof GuestModel> {
  @post("/signup")
  signupGuest() {
    return this.signup(GuestModel);
  }

  @post("/login")
  loginGuest() {
    return this.login(GuestModel);
  }

  @get()
  getAllGuests() {
    return this.getAll(GuestModel);
  }

  @get("/forgetPassword")
  guestForgetPassword() {
    return this.forgetPassword(GuestModel);
  }

  @patch("/:userId/resetPassword/:token")
  guestResetPassword() {
    return this.resetPassword(GuestModel);
  }

  @protect()
  @del("/deleteMe")
  deleteMeForGuest() {
    return this.deleteMe(GuestModel);
  }

  @protect()
  @patch("/updateUserInfo")
  updateguestInfo() {
    return this.updateUserInfo(GuestModel);
  }

  @protect()
  @patch("/updatePassword")
  updateGuestPassword() {
    return this.updatePassword(GuestModel);
  }
}
