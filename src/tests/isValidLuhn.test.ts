import { isValidLuhn } from "@/utils/isValidLuhn.js";
import { describe, test, expect } from "vitest";

describe("isValidLuhn", () => {
  test("accepts a known-valid 16-digit number", () => {
    expect(isValidLuhn("4111111111111111")).toBe(true);
  });

  test("accepts a known-valid Mastercard-shaped number", () => {
    expect(isValidLuhn("5500005555555559")).toBe(true);
  });

  test("accepts a known-valid 15-digit Amex-shaped number", () => {
    expect(isValidLuhn("340000000000009")).toBe(true);
  });

  test("rejects the same number with its last digit altered", () => {
    // 4111111111111111 is valid; flipping the final digit must break the checksum.
    expect(isValidLuhn("4111111111111112")).toBe(false);
  });

  test("rejects the same number with a middle digit altered", () => {
    expect(isValidLuhn("4111111111121111")).toBe(false);
  });

  test("rejects a clearly invalid sequence", () => {
    expect(isValidLuhn("1234567812345678")).toBe(false);
  });

  test("accepts a known-valid number at the shortest plausible length (13 digits)", () => {
    expect(isValidLuhn("4222222222222")).toBe(true);
  });

  test("accepts a known-valid number at the longest plausible length (19 digits)", () => {
    expect(isValidLuhn("4111111111111111110")).toBe(true);
  });
});
