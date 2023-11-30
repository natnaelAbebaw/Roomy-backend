import { controller } from "../decorators/controller";
import { del, get, patch, post } from "../decorators/routeHandles";
import { HotelModel } from "../models/hotelModel";
import { Controller } from "../services/Controllers";

@controller("/hotels")
export class HotelsController extends Controller<typeof HotelModel> {
  @get()
  getHotelAll() {
    return this.getAll(HotelModel);
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
