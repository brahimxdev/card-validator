export type NormalizationResult =
  | { ok: true; digits: string }
  | { ok: false; reason: "invalid_characters" | "invalid_length" };

const MIN_LENGTH = 13;
const MAX_LENGTH = 19;

const STRIPPABLE_SEPARATORS = /[ -]/g;
const DIGITS_ONLY = /^\d+$/;

export const normalizeCardNumber = (raw: string): NormalizationResult => {
  const strippedDigits = raw.replace(STRIPPABLE_SEPARATORS, "");

  if (!DIGITS_ONLY.test(strippedDigits)) {
    return { ok: false, reason: "invalid_characters" };
  }

  if (strippedDigits.length < MIN_LENGTH || strippedDigits.length > MAX_LENGTH) {
    return { ok: false, reason: "invalid_length" };
  }

  return { ok: true, digits: strippedDigits };
};
