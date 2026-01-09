import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock @vercel/blob before import
vi.mock("@vercel/blob", () => ({
  put: vi
    .fn()
    .mockResolvedValue({ url: "https://blob.vercel-storage.com/test.png" }),
}));

// Mock nanoid for predictable filename
vi.mock("nanoid", () => ({
  nanoid: () => "test-nanoid-123",
}));

// Import after mocking
import { put } from "@vercel/blob";
import { uploadImageToBlob } from "@/utils/blob";

describe("uploadImageToBlob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("mediaType validation", () => {
    it("throws error for non-image mediaType", async () => {
      const base64 = "dGVzdA=="; // "test" in base64

      await expect(uploadImageToBlob(base64, "text/plain")).rejects.toThrow(
        "Invalid mediaType: must be an image type",
      );
    });

    it("throws error for application/json mediaType", async () => {
      const base64 = "dGVzdA==";

      await expect(
        uploadImageToBlob(base64, "application/json"),
      ).rejects.toThrow("Invalid mediaType: must be an image type");
    });

    it("accepts image/png mediaType", async () => {
      const base64 = "dGVzdA==";

      await expect(
        uploadImageToBlob(base64, "image/png"),
      ).resolves.toBeDefined();
    });

    it("accepts image/jpeg mediaType", async () => {
      const base64 = "dGVzdA==";

      await expect(
        uploadImageToBlob(base64, "image/jpeg"),
      ).resolves.toBeDefined();
    });

    it("accepts image/webp mediaType", async () => {
      const base64 = "dGVzdA==";

      await expect(
        uploadImageToBlob(base64, "image/webp"),
      ).resolves.toBeDefined();
    });
  });

  describe("file extension extraction", () => {
    it("extracts png extension from image/png", async () => {
      const base64 = "dGVzdA==";

      await uploadImageToBlob(base64, "image/png");

      expect(put).toHaveBeenCalledWith(
        "images/test-nanoid-123.png",
        expect.any(Buffer),
        expect.objectContaining({ contentType: "image/png" }),
      );
    });

    it("extracts jpeg extension from image/jpeg", async () => {
      const base64 = "dGVzdA==";

      await uploadImageToBlob(base64, "image/jpeg");

      expect(put).toHaveBeenCalledWith(
        "images/test-nanoid-123.jpeg",
        expect.any(Buffer),
        expect.objectContaining({ contentType: "image/jpeg" }),
      );
    });

    it("extracts webp extension from image/webp", async () => {
      const base64 = "dGVzdA==";

      await uploadImageToBlob(base64, "image/webp");

      expect(put).toHaveBeenCalledWith(
        "images/test-nanoid-123.webp",
        expect.any(Buffer),
        expect.objectContaining({ contentType: "image/webp" }),
      );
    });
  });

  describe("return value", () => {
    it("returns url from blob storage", async () => {
      const base64 = "dGVzdA==";

      const result = await uploadImageToBlob(base64, "image/png");

      expect(result.url).toBe("https://blob.vercel-storage.com/test.png");
    });

    it("returns prompt when provided", async () => {
      const base64 = "dGVzdA==";

      const result = await uploadImageToBlob(base64, "image/png", "A cute cat");

      expect(result.prompt).toBe("A cute cat");
    });

    it("returns undefined prompt when not provided", async () => {
      const base64 = "dGVzdA==";

      const result = await uploadImageToBlob(base64, "image/png");

      expect(result.prompt).toBeUndefined();
    });
  });

  describe("buffer conversion", () => {
    it("passes buffer to put function", async () => {
      const base64 = "dGVzdA=="; // "test" in base64

      await uploadImageToBlob(base64, "image/png");

      expect(put).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Buffer),
        expect.any(Object),
      );

      // Verify the buffer content
      const calledBuffer = (put as ReturnType<typeof vi.fn>).mock.calls[0][1];
      expect(calledBuffer.toString()).toBe("test");
    });
  });

  describe("put options", () => {
    it("sets access to public", async () => {
      const base64 = "dGVzdA==";

      await uploadImageToBlob(base64, "image/png");

      expect(put).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Buffer),
        expect.objectContaining({ access: "public" }),
      );
    });
  });
});
