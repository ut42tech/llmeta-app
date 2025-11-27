import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

type UploadImageResult = {
  url: string;
  prompt?: string;
};

/**
 * Upload an image to Vercel Blob storage
 */
export async function uploadImageToBlob(
  base64: string,
  mediaType: string,
  prompt?: string,
): Promise<UploadImageResult> {
  if (!mediaType.startsWith("image/")) {
    throw new Error("Invalid mediaType: must be an image type");
  }

  const buffer = Buffer.from(base64, "base64");
  const ext = mediaType.split("/")[1] || "png";
  const filename = `images/${nanoid()}.${ext}`;

  const blob = await put(filename, buffer, {
    access: "public",
    contentType: mediaType,
  });

  return { url: blob.url, prompt };
}
