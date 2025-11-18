import { NextResponse } from "next/server";
import { createLiveKitAccessToken } from "@/lib/livekit/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      identity?: string;
      name?: string;
      roomName?: string;
      metadata?: Record<string, unknown>;
      ttl?: number;
    };

    if (!body?.identity) {
      return NextResponse.json(
        { error: "identity is required" },
        { status: 400 },
      );
    }

    const token = await createLiveKitAccessToken({
      identity: body.identity,
      name: body.name,
      roomName: body.roomName,
      metadata: body.metadata,
      ttl: body.ttl,
    });

    return NextResponse.json(token);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
