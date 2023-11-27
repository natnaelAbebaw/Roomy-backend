import { Request, Response } from "express";
import { controller } from "../decorators/controller";
import { del, get, patch, post } from "../decorators/routeHandles";
import { CabinModel } from "../models/cabinModel";

@controller("/cabins")
class CabinController {
  @get()
  async getCabinAll(req: Request, res: Response) {
    const cabins = await CabinModel.find({});
    res.status(200).json({ status: "success", length: cabins.length, cabins });
  }

  @get("/:id")
  async getCabin(req: Request, res: Response) {
    const id = req.params.id;
    const cabin = await CabinModel.findById({ _id: id });
    if (cabin) res.status(200).json({ status: "success", length: 1, cabin });
    else res.status(404).json({ status: "fail", message: "cabin not found" });
  }

  @post()
  async addCabin(req: Request, res: Response) {
    const cabin = await CabinModel.create(req.body);
    if (cabin) res.status(201).json({ status: "success", length: 1, cabin });
  }

  @del("/:id")
  async deleteCabin(req: Request, res: Response) {
    const cabin = await CabinModel.findByIdAndDelete(req.params.id);
    if (cabin) res.status(204).json({ status: "success" });
    else res.status(404).json({ status: "fail", message: "cabin not found" });
  }

  @patch("/:id")
  async updateCabin(req: Request, res: Response) {
    const cabin = await CabinModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (cabin) res.status(200).json({ status: "success", length: 1, cabin });
    else res.status(404).json({ status: "fail", message: "cabin not found" });
  }
}
