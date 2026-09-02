import { describe, test, expect, vi, beforeEach } from "vitest";
import { normalizeCardNumber } from "@/utils/normalizeCardNumber.js";
import { isValidLuhn } from "@/utils/isValidLuhn.js";
import { detectBrand } from "@/utils/brandDetector.js";
import { CardValidatorService } from "@/modules/card-validator/cardValidator.service.js";

vi.mock("@/utils/normalizeCardNumber.js");
vi.mock("@/utils/isValidLuhn.js");
vi.mock("@/utils/brandDetector.js");

const mockNormalize = vi.mocked(normalizeCardNumber);
const mockIsValidLuhn = vi.mocked(isValidLuhn);
const mockDetectBrand = vi.mocked(detectBrand);

describe("CardValidatorService", () => {
  let service: CardValidatorService;

  beforeEach(() => {
    service = new CardValidatorService();
    vi.resetAllMocks();
  });

  test("returns valid: true with brand when normalization, luhn, and brand detection all succeed", () => {
    mockNormalize.mockReturnValue({ ok: true, digits: "4111111111111111" });
    mockIsValidLuhn.mockReturnValue(true);
    mockDetectBrand.mockReturnValue("visa");

    const result = service.validate("4111 1111 1111 1111");

    expect(result).toEqual({ valid: true, brand: "visa" });
    expect(mockNormalize).toHaveBeenCalledWith("4111 1111 1111 1111");
    expect(mockIsValidLuhn).toHaveBeenCalledWith("4111111111111111");
    expect(mockDetectBrand).toHaveBeenCalledWith("4111111111111111");
  });

  test("returns invalid_characters reason and does not call luhn or brand detection when normalization fails on characters", () => {
    mockNormalize.mockReturnValue({ ok: false, reason: "invalid_characters" });

    const result = service.validate("abcd-efgh-ijkl-mnop");

    expect(result).toEqual({
      valid: false,
      reason: "invalid_characters",
      brand: null,
    });
    expect(mockIsValidLuhn).not.toHaveBeenCalled();
    expect(mockDetectBrand).not.toHaveBeenCalled();
  });

  test("returns invalid_length reason when normalization fails on length", () => {
    mockNormalize.mockReturnValue({ ok: false, reason: "invalid_length" });

    const result = service.validate("4111");

    expect(result).toEqual({
      valid: false,
      reason: "invalid_length",
      brand: null,
    });
    expect(mockIsValidLuhn).not.toHaveBeenCalled();
    expect(mockDetectBrand).not.toHaveBeenCalled();
  });

  test("returns failed_luhn reason but still includes detected brand when luhn check fails", () => {
    mockNormalize.mockReturnValue({ ok: true, digits: "4111111111111112" });
    mockDetectBrand.mockReturnValue("visa");
    mockIsValidLuhn.mockReturnValue(false);

    const result = service.validate("4111111111111112");

    expect(result).toEqual({
      valid: false,
      reason: "failed_luhn",
      brand: "visa",
    });
  });

  test("returns unrecognized_brand reason with brand: null when luhn passes but brand is not detected", () => {
    mockNormalize.mockReturnValue({ ok: true, digits: "9999999999999999" });
    mockIsValidLuhn.mockReturnValue(true);
    mockDetectBrand.mockReturnValue(null);

    const result = service.validate("9999999999999999");

    expect(result).toEqual({
      valid: false,
      reason: "unrecognized_brand",
      brand: null,
    });
  });

  test("prioritizes failed_luhn over unrecognized_brand when both checks fail", () => {
    mockNormalize.mockReturnValue({ ok: true, digits: "9999999999999998" });
    mockIsValidLuhn.mockReturnValue(false);
    mockDetectBrand.mockReturnValue(null);

    const result = service.validate("9999999999999998");

    expect(result).toEqual({
      valid: false,
      reason: "failed_luhn",
      brand: null,
    });
  });
});
