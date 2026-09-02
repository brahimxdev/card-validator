import express from "express";
import morgan from "morgan";
import type { Request, Response, NextFunction } from "express";
import { isDev } from "./config/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { AppError } from "@/errors/AppError.js";
import { healthRouter } from "./health/health.routes.js";
import { cardValidatorRouter } from "./modules/card-validator/cardValidator.routes.js";

const app = express();

// Global middleware
if (isDev) {
  app.use(morgan("dev"));
}

// Deserialize all coming request data into json
app.use(express.json());

// Mounting Routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/public/cards", cardValidatorRouter);

// Catch all routes and display 404 for not matched route
app.use((req: Request, _res: Response, _next: NextFunction) => {
  throw AppError.notFound(`Can't find ${req.originalUrl} on this server`);
});

app.use(errorHandler);

export default app;
