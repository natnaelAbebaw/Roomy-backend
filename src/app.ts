import express, { Express } from "express";
import morgan from "morgan";
import { router } from "./decorators/controller";

const App: Express = express();

App.use(morgan("dev"));
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(router);

// app.all("*", (req, res, next) => {
//   next(new AppError(`route not found: ${req.originalUrl}`, 404));
// });

export default App;
