import type { CardValidatorService } from "./cardValidator.service.js";
import { HttpStatus } from "@/errors/index.js";
import type { Response } from "express";
import type { TypedBodyRequest } from "@/types/typed-request.js";
import type { ICardNumber } from "./cardValidator.validate.js";

export class CardValidatorController {
  constructor(private readonly cardValidatorService: CardValidatorService) {}
  // eslint-disable-next-line @typescript-eslint/require-await
  validateCard = async (req: TypedBodyRequest<ICardNumber>, res: Response): Promise<void> => {
    //* Validation middleware already validated data!

    const { cardNumber } = req.validated.body;

    // Service layer to handle logic
    const result = this.cardValidatorService.validate(cardNumber);

    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  };
}
