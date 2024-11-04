import { controller } from "../decorators/controllerDecorator";
import { get, post, patch, del } from "../decorators/routeHandlerDecorators";
import { protect } from "../decorators/authDecorators";
import { HotelAccountModel } from "../models/hotelAccount";
import { AuthController } from "./AuthController";

@controller("/hotelAccounts")
export class AuthHotelController extends AuthController<
  typeof HotelAccountModel
> {
  @post("/signup")
  signupHotelAccount() {
    return this.signup(HotelAccountModel);
  }

  @post("/login")
  loginHotelAccount() {
    return this.login(HotelAccountModel);
  }

  @get()
  getAllHotelAccounts() {
    return this.getAll(HotelAccountModel);
  }

  @get("/forgetPassword")
  hotelAccountForgetPassword() {
    return this.forgetPassword(HotelAccountModel);
  }

  @patch("/:userId/resetPassword/:token")
  hotelAccountResetPassword() {
    return this.resetPassword(HotelAccountModel);
  }

  @protect()
  @del("/deleteMe")
  deleteMeForHotelAccount() {
    return this.deleteMe(HotelAccountModel);
  }

  @protect()
  @patch("/updateUserInfo")
  updateHotelAccountInfo() {
    return this.updateUserInfo(HotelAccountModel);
  }

  @protect()
  @patch("/updatePassword")
  updateHotelAccountPassword() {
    return this.updatePassword(HotelAccountModel);
  }
}
