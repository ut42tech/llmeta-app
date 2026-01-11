import { createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";
import { requireAuth } from "@/utils/api-auth";

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

const getClient = () => {
  if (!DEEPGRAM_API_KEY) {
    throw new Error("Missing DEEPGRAM_API_KEY environment variable");
  }
  return createClient(DEEPGRAM_API_KEY);
};

export async function GET() {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const deepgram = getClient();
    const { result, error: grantError } = await deepgram.auth.grantToken();

    if (grantError) {
      throw new Error(grantError.message ?? "Failed to grant Deepgram token");
    }

    if (!result?.access_token) {
      throw new Error("Deepgram token response is missing access_token");
    }

    return NextResponse.json({
      accessToken: result.access_token,
      expiresIn: result.expires_in,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Deepgram API] Token generation failed:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
