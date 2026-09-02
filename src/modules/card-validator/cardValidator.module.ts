import { CardValidatorController } from "./cardValidator.controller.js";
import { CardValidatorService } from "./cardValidator.service.js";

export const cardValidatorService = new CardValidatorService();
export const cardValidatorController = new CardValidatorController(cardValidatorService);
