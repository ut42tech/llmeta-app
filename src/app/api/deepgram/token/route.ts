import { createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

    if (error || !result?.access_token) {
      throw new Error(
        error?.message ?? "Failed to create Deepgram access token",
      );
    }

    return NextResponse.json({
      accessToken: result.access_token,
      expiresIn: result.expires_in,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
