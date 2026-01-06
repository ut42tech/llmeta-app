import { describe, expect, it } from "vitest";
import {
  defaultLocale,
  type Locale,
  localeNames,
  locales,
} from "@/i18n/config";

describe("i18n config", () => {
  describe("locales", () => {
    it("contains English", () => {
      expect(locales).toContain("en");
    });

    it("contains Japanese", () => {
      expect(locales).toContain("ja");
    });

    it("has exactly 2 locales", () => {
      expect(locales).toHaveLength(2);
    });
  });

  describe("defaultLocale", () => {
    it("is English", () => {
      expect(defaultLocale).toBe("en");
    });

    it("is a valid locale", () => {
      expect(locales).toContain(defaultLocale);
    });
  });

  describe("localeNames", () => {
    it("has name for English", () => {
      expect(localeNames.en).toBe("English");
    });

    it("has name for Japanese", () => {
      expect(localeNames.ja).toBe("日本語");
    });

    it("has names for all locales", () => {
      for (const locale of locales) {
        expect(localeNames[locale]).toBeDefined();
        expect(typeof localeNames[locale]).toBe("string");
        expect(localeNames[locale].length).toBeGreaterThan(0);
      }
    });
  });

  describe("type safety", () => {
    it("Locale type matches locales array", () => {
      const testLocale: Locale = "en";
      expect(locales).toContain(testLocale);

      const testLocale2: Locale = "ja";
      expect(locales).toContain(testLocale2);
    });
  });
});
