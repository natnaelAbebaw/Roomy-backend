import { controller } from "../decorators/controller";
import { del, get, patch, post } from "../decorators/routeHandles";
import { BookingModel } from "../models/bookingModel";
import { Controller } from "../services/Controllers";

@controller("/bookings")
export class CabinController extends Controller<typeof BookingModel> {
  @get()
  getBookingAll() {
    return this.getAll(BookingModel);
  }

  @get("/:id")
  getBooking() {
    return this.getOne(BookingModel);
  }

  @post()
  createBooking() {
    return this.create(BookingModel);
  }

  @del("/:id")
  deleteBooking() {
    return this.delete(BookingModel);
  }

  @patch("/:id")
  updateBooking() {
    return this.update(BookingModel);
  }
}
