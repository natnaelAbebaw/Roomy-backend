import { RolesModel } from "./../models/rolesModel";
import { controller } from "../decorators/controllerDecorator";
import { del, get, patch, post } from "../decorators/routeHandlerDecorators";
import { protect } from "../decorators/authDecorators";
import { Controller } from "../services/Controllers";

@controller("/roles")
export class RolesController extends Controller<typeof RolesModel> {
  @get()
  getAllRoles() {
    return this.getAll(RolesModel);
  }

  @get("/:id")
  getRole() {
    return this.getOne(RolesModel);
  }

  @post()
  createRole() {
    return this.create(RolesModel);
  }

  @del("/:id")
  deleteRole() {
    return this.delete(RolesModel);
  }

  @patch("/:id")
  updateRole() {
    return this.update(RolesModel);
  }
}
