import { isValidLuhn } from "@/utils/isValidLuhn.js";
import { normalizeCardNumber } from "@/utils/normalizeCardNumber.js";
import { detectBrand, type CardBrand } from "@/utils/brandDetector.js";
import type { NormalizationResult } from "@/utils/normalizeCardNumber.js";

export type CardInvalidReason =
  | Extract<NormalizationResult, { ok: false }>["reason"]
  | "failed_luhn"
  | "unrecognized_brand";

export type CardValidationResult =
  | { valid: true; brand: CardBrand }
  | { valid: false; reason: CardInvalidReason; brand: CardBrand | null };

export class CardValidatorService {
  // Validate card by normalizing, checking luhn validity, and brand
  validate(rawInput: string): CardValidationResult {
    const normalized = normalizeCardNumber(rawInput);

    if (!normalized.ok) {
      return { valid: false, reason: normalized.reason, brand: null };
    }

    const { digits } = normalized;
    const brand = detectBrand(digits);

    if (!isValidLuhn(digits)) {
      return { valid: false, reason: "failed_luhn", brand };
    }

    if (!brand) {
      return { valid: false, reason: "unrecognized_brand", brand: null };
    }

    return { valid: true, brand };
  }
}
