import { validateRequest } from "@/middlewares/validateRequest.js";
import { Router } from "express";
import { cardValidatorController } from "./cardValidator.module.js";
import { asyncBodyHandler } from "@/utils/asyncHandler.js";
import { cardNumberSchema } from "./cardValidator.validate.js";

export const cardValidatorRouter = Router();

//* base url - /api/v1/public/cards

cardValidatorRouter.post(
  "/validate",
  validateRequest({ body: cardNumberSchema }),
  asyncBodyHandler(cardValidatorController.validateCard)
);
