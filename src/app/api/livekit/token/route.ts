import { NextResponse } from "next/server";
import { createLiveKitAccessToken } from "@/utils/livekit-server";

type TokenPayload = {
  identity: string;
  name?: string;
  roomName?: string;
  metadata?: Record<string, unknown>;
  ttl?: number;
};

const respondWithToken = async (payload: TokenPayload) => {
  const { token, serverUrl, roomName } =
    await createLiveKitAccessToken(payload);
  return NextResponse.json({
    accessToken: token,
    token,
    serverUrl,
    roomName,
  });
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const identity = searchParams.get("identity") || undefined;
    const name = searchParams.get("name") || undefined;
    const roomName = searchParams.get("roomName") || undefined;
    const ttlParam = searchParams.get("ttl");
    const metadataParam = searchParams.get("metadata");

    if (!identity) {
      return NextResponse.json(
        { error: "identity is required" },
        { status: 400 },
      );
    }

    let metadata: Record<string, unknown> | undefined;
    if (metadataParam) {
      try {
        metadata = JSON.parse(metadataParam) as Record<string, unknown>;
      } catch {
        return NextResponse.json(
          { error: "metadata must be JSON serializable" },
          { status: 400 },
        );
      }
    }

    let ttl: number | undefined;
    if (ttlParam) {
      ttl = Number(ttlParam);
      if (Number.isNaN(ttl)) {
        return NextResponse.json(
          { error: "ttl must be a number" },
          { status: 400 },
        );
      }
    }

    return await respondWithToken({
      identity,
      name,
      roomName,
      metadata,
      ttl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TokenPayload | undefined;

    if (!body?.identity) {
      return NextResponse.json(
        { error: "identity is required" },
        { status: 400 },
      );
    }

    return await respondWithToken(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
