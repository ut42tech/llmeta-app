import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/utils/api-auth";
import { uploadImageToBlob } from "@/utils/blob";

type UploadRequestBody = {
  base64: string;
  mediaType: string;
  prompt?: string;
};

export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAuth();
    if (authError) return authError;

    const body = (await request.json()) as UploadRequestBody;
    const { base64, mediaType, prompt } = body;

    if (!base64 || !mediaType) {
      return NextResponse.json(
        { error: "Missing required fields: base64, mediaType" },
        { status: 400 },
      );
    }

    const result = await uploadImageToBlob(base64, mediaType, prompt);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Image Upload] Error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
