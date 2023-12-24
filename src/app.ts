import {
  CabinController,
  HotelsController,
  BookingController,
  AuthGuestController,
  AuthHotelController,
  RolesController,
} from "./controllers/index";
import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import AppError from "./services/AppError";
import { globalErrorHandler } from "./services/globalErrorHandler";

const App: Express = express();
const url = process.env.BASE_URL || "/api/v1";

App.use(morgan("dev"));
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(url, CabinController.getRouter());
App.use(url, HotelsController.getRouter());
App.use(url, BookingController.getRouter());
App.use(url, AuthGuestController.getRouter());
App.use(url, AuthHotelController.getRouter());
App.use(url, RolesController.getRouter());

App.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

App.use(globalErrorHandler);

export default App;
