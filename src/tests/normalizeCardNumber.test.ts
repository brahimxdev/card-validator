import { normalizeCardNumber } from "@/utils/normalizeCardNumber.js";
import { describe, test, expect } from "vitest";

describe("normalizeCardNumber", () => {
  describe("separator stripping", () => {
    test("should passes a valid digit-only string", () => {
      const result = normalizeCardNumber("4111111111111111");
      expect(result).toEqual({ ok: true, digits: "4111111111111111" });
    });
    test("should strips spaces and normalizes correctly", () => {
      const result = normalizeCardNumber("4111 1111 1111 1111");

      expect(result).toEqual({ ok: true, digits: "4111111111111111" });
    });
    test("should strips dashes and normalizes correctly", () => {
      const result = normalizeCardNumber("4111-1111-1111-1111");

      expect(result).toEqual({ ok: true, digits: "4111111111111111" });
    });

    test("should strips a mix of spaces and dashes", () => {
      const result = normalizeCardNumber("4111 1111-1111 1111");

      expect(result).toEqual({ ok: true, digits: "4111111111111111" });
    });
  });

  describe("character validation", () => {
    test("should rejects a string with letters remaining after stripping", () => {
      const result = normalizeCardNumber("4111-1111-1111-111a");

      expect(result).toEqual({ ok: false, reason: "invalid_characters" });
    });
    test("shoudl rejects a string with symbols remaining after stripping", () => {
      const result = normalizeCardNumber("4111#1111#1111#1111");

      expect(result).toEqual({ ok: false, reason: "invalid_characters" });
    });
    test("should rejects an empty string", () => {
      const result = normalizeCardNumber("");

      expect(result).toEqual({ ok: false, reason: "invalid_characters" });
    });
    test("should rejects a string of only separators", () => {
      const result = normalizeCardNumber("  --  ");

      expect(result).toEqual({ ok: false, reason: "invalid_characters" });
    });
  });

  describe("length validation", () => {
    test("should rejects a digit string shorter than the minimum length", () => {
      const result = normalizeCardNumber("41111111");

      expect(result).toEqual({ ok: false, reason: "invalid_length" });
    });
    test("should rejects a digit string longer than the maximum length", () => {
      const result = normalizeCardNumber("41111111111111111111");

      expect(result).toEqual({ ok: false, reason: "invalid_length" });
    });
    test("should accepts the shortest plausible length (13 digits)", () => {
      const result = normalizeCardNumber("4111111111111");

      expect(result).toEqual({ ok: true, digits: "4111111111111" });
    });

    test("should accepts the longest plausible length (19 digits)", () => {
      const result = normalizeCardNumber("4111111111111111111");

      expect(result).toEqual({ ok: true, digits: "4111111111111111111" });
    });
  });
});
