import { createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

const getClient = () => {
  if (!DEEPGRAM_API_KEY) {
    throw new Error("Missing DEEPGRAM_API_KEY environment variable");
  }

  return createClient(DEEPGRAM_API_KEY);
};

export async function GET() {
  try {
    const deepgram = getClient();
    const { result, error } = await deepgram.auth.grantToken();

    if (error) {
      throw new Error(error.message ?? "Failed to grant Deepgram token");
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
