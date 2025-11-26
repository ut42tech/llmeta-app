import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";

type UploadRequestBody = {
  base64: string;
  mediaType: string;
  prompt?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UploadRequestBody;
    const { base64, mediaType, prompt } = body;

    if (!base64 || !mediaType) {
      return NextResponse.json(
        { error: "Missing required fields: base64, mediaType" },
        { status: 400 },
      );
    }

    if (!mediaType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid mediaType: must be an image type" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(base64, "base64");

    const ext = mediaType.split("/")[1] || "png";
    const filename = `chat-images/${nanoid()}.${ext}`;

    const blob = await put(filename, buffer, {
      access: "public",
      contentType: mediaType,
    });

    return NextResponse.json({ url: blob.url, prompt });
  } catch (error) {
    console.error("[Image Upload] Error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
