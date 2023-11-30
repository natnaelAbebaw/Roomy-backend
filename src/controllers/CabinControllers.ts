import { controller } from "../decorators/controller";
import { del, get, patch, post } from "../decorators/routeHandles";
import { CabinModel } from "../models/cabinModel";
import { Controller } from "../services/Controllers";


@controller("/cabins")
export class CabinController extends Controller<typeof CabinModel> {
  @get()
  getCabinAll() {
    return this.getAll(CabinModel);
  }

  @get("/:id")
  getCabin() {
    return this.getOne(CabinModel);
  }

  @post()
  createCabin() {
    return this.create(CabinModel);
  }

  @del("/:id")
  deleteCabin() {
    return this.delete(CabinModel);
  }

  @patch("/:id")
  updateCabin() {
    return this.update(CabinModel);
  }
}
