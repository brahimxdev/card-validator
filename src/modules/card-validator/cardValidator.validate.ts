import { z } from "zod";

export const cardNumberSchema = z.object({
  cardNumber: z
    .string()
    .trim()
    .min(1, "cardNumber must not be empty")
    .max(25, "cardNumber is too long"),
});

export type ICardNumber = z.infer<typeof cardNumberSchema>;
