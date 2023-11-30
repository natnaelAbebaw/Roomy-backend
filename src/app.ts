import { CabinController, HotelsController } from "./controllers/index";
import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import AppError from "./services/AppError";
import { globalErrorHandler } from "./services/globalErrorHandler";

const App: Express = express();

App.use(morgan("dev"));
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(CabinController.getRouter());
App.use(HotelsController.getRouter());

App.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

App.use(globalErrorHandler);

export default App;
