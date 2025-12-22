import { describe, expect, it } from "vitest";
import { normalizeAngle, roundToDecimals } from "@/utils/math";

describe("roundToDecimals", () => {
  it("rounds to 2 decimal places by default", () => {
    expect(roundToDecimals(1.23456)).toBe(1.23);
    expect(roundToDecimals(2.555)).toBe(2.56);
  });

  it("rounds to specified decimal places", () => {
    expect(roundToDecimals(1.23456, 0)).toBe(1);
    expect(roundToDecimals(1.23456, 1)).toBe(1.2);
    expect(roundToDecimals(1.23456, 3)).toBe(1.235);
    expect(roundToDecimals(1.23456, 4)).toBe(1.2346);
  });

  it("handles integers correctly", () => {
    expect(roundToDecimals(42)).toBe(42);
    expect(roundToDecimals(42, 3)).toBe(42);
  });

  it("rounds negative numbers correctly", () => {
    expect(roundToDecimals(-1.23456)).toBe(-1.23);
    expect(roundToDecimals(-2.555)).toBe(-2.56); // Math.round rounds toward positive infinity
  });

  it("handles zero correctly", () => {
    expect(roundToDecimals(0)).toBe(0);
    expect(roundToDecimals(0.0001, 2)).toBe(0);
  });
});

describe("normalizeAngle", () => {
  it("returns angles within range as-is", () => {
    expect(normalizeAngle(0)).toBe(0);
    expect(normalizeAngle(1)).toBeCloseTo(1);
    expect(normalizeAngle(-1)).toBeCloseTo(-1);
  });

  it("handles values near PI correctly", () => {
    expect(normalizeAngle(Math.PI)).toBeCloseTo(-Math.PI);
    expect(normalizeAngle(-Math.PI)).toBeCloseTo(-Math.PI);
  });

  it("normalizes angles greater than 2PI", () => {
    expect(normalizeAngle(3 * Math.PI)).toBeCloseTo(-Math.PI);
    expect(normalizeAngle(4 * Math.PI)).toBeCloseTo(0, 5);
  });

  it("handles negative angles", () => {
    expect(normalizeAngle(-Math.PI)).toBeCloseTo(-Math.PI);
    expect(normalizeAngle(-Math.PI / 2)).toBeCloseTo(-Math.PI / 2);
  });
});
