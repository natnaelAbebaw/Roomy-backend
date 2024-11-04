import {
  CabinController,
  HotelsController,
  BookingController,
  AuthGuestController,
  AuthHotelController,
  RolesController,
  CabinReviewController,
  SearchLocationProxyController,
} from "./controllers/index";
import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import AppError from "./services/AppError";
import { globalErrorHandler } from "./services/globalErrorHandler";
import { routers } from "./decorators/Routers";
import cors from "cors";

const App: Express = express();

const url = process.env.BASE_URL || "/api/v1";
App.use(cors());

App.use(morgan("dev"));
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(`${url}/uploads`, express.static("uploads"));

App.use(url, routers[HotelsController.name]);
App.use(url, routers[CabinController.name]);
App.use(url, routers[BookingController.name]);
App.use(url, routers[AuthGuestController.name]);
App.use(url, routers[AuthHotelController.name]);
App.use(url, routers[RolesController.name]);
App.use(url, routers[CabinReviewController.name]);
App.use(url, routers[SearchLocationProxyController.name]);

App.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

App.use(globalErrorHandler);

export default App;
