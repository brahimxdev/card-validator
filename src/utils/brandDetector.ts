// Card brands this detector can recognize, based on publicly documented IIN/BIN prefix ranges. This is informational metadata only
export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "diners_club" | "jcb";

interface BrandRule {
  brand: CardBrand;
  prefixLength: number;
  min: number;
  max: number;
}

const BRAND_RULES: readonly BrandRule[] = [
  // Discover's 6-digit range
  { brand: "discover", prefixLength: 6, min: 622126, max: 622925 },

  // Mastercard's 2017 extension.
  { brand: "mastercard", prefixLength: 4, min: 2221, max: 2720 },

  { brand: "discover", prefixLength: 4, min: 6011, max: 6011 },
  { brand: "jcb", prefixLength: 4, min: 3528, max: 3589 },

  { brand: "discover", prefixLength: 3, min: 644, max: 649 },
  { brand: "diners_club", prefixLength: 3, min: 300, max: 305 },

  // Mastercard's original block
  { brand: "mastercard", prefixLength: 2, min: 51, max: 55 },

  // Amex
  { brand: "amex", prefixLength: 2, min: 34, max: 34 },
  { brand: "amex", prefixLength: 2, min: 37, max: 37 },

  { brand: "discover", prefixLength: 2, min: 65, max: 65 },
  { brand: "diners_club", prefixLength: 2, min: 36, max: 36 },
  { brand: "diners_club", prefixLength: 2, min: 38, max: 38 },

  { brand: "visa", prefixLength: 1, min: 4, max: 4 },
];

const SORTED_RULES = [...BRAND_RULES].sort((a, b) => b.prefixLength - a.prefixLength);

// Detects the card brand from a digit-only string's leading digits.
export const detectBrand = (digits: string): CardBrand | null => {
  for (const rule of SORTED_RULES) {
    if (digits.length < rule.prefixLength) {
      continue;
    }

    const prefix = Number(digits.slice(0, rule.prefixLength));

    if (prefix >= rule.min && prefix <= rule.max) {
      return rule.brand;
    }
  }

  return null;
};
