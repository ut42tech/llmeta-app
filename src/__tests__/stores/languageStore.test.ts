import { beforeEach, describe, expect, it } from "vitest";
import { useLanguageStore } from "@/stores/languageStore";

describe("useLanguageStore", () => {
  beforeEach(() => {
    // Reset to default state
    useLanguageStore.setState({ locale: "en" });
  });

  describe("initial state", () => {
    it("has default locale", () => {
      const { locale } = useLanguageStore.getState();
      expect(locale).toBe("en");
    });
  });

  describe("setLocale", () => {
    it("sets valid locale", () => {
      const { setLocale } = useLanguageStore.getState();

      setLocale("ja");

      expect(useLanguageStore.getState().locale).toBe("ja");
    });

    it("sets another valid locale", () => {
      const { setLocale } = useLanguageStore.getState();

      setLocale("en");

      expect(useLanguageStore.getState().locale).toBe("en");
    });
  });

  describe("initializeFromProfile", () => {
    it("sets locale from valid profile lang", () => {
      const { initializeFromProfile } = useLanguageStore.getState();

      initializeFromProfile("ja");

      expect(useLanguageStore.getState().locale).toBe("ja");
    });

    it("ignores null lang", () => {
      const { setLocale, initializeFromProfile } = useLanguageStore.getState();

      setLocale("ja");
      initializeFromProfile(null);

      expect(useLanguageStore.getState().locale).toBe("ja");
    });

    it("ignores invalid lang", () => {
      const { setLocale, initializeFromProfile } = useLanguageStore.getState();

      setLocale("ja");
      initializeFromProfile("invalid-lang");

      expect(useLanguageStore.getState().locale).toBe("ja");
    });
  });
});
