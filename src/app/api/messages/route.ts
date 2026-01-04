import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_LIMIT = 50;

/**
 * GET /api/messages?instanceId=xxx&limit=50
 * Fetch messages for an instance with optional images
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const instanceId = searchParams.get("instanceId");
  const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;

  if (!instanceId) {
    return NextResponse.json(
      { error: "instanceId is required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // Fetch messages with sender profile and images
  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      id,
      instance_id,
      sender_id,
      content,
      type,
      sent_at,
      profiles:sender_id (display_name),
      message_images (id, url, prompt)
    `,
    )
    .eq("instance_id", instanceId)
    .order("sent_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[API] Failed to fetch messages:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data });
}

type PostBody = {
  instanceId: string;
  content?: string;
  image?: { url: string; prompt?: string };
};

/**
 * POST /api/messages
 * Create a new message with optional image
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as PostBody;
  const { instanceId, content, image } = body;

  if (!instanceId) {
    return NextResponse.json(
      { error: "instanceId is required" },
      { status: 400 },
    );
  }

  if (!content && !image) {
    return NextResponse.json(
      { error: "content or image is required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Insert message
  const { data: message, error: messageError } = await supabase
    .from("messages")
    .insert({
      instance_id: instanceId,
      sender_id: user.id,
      content: content || null,
      type: "user",
    })
    .select("id, instance_id, sender_id, content, type, sent_at")
    .single();

  if (messageError || !message) {
    console.error("[API] Failed to create message:", messageError);
    return NextResponse.json(
      { error: messageError?.message || "Failed to create message" },
      { status: 500 },
    );
  }

  // Insert image if provided
  if (image) {
    const { error: imageError } = await supabase.from("message_images").insert({
      message_id: message.id,
      url: image.url,
      prompt: image.prompt || null,
    });

    if (imageError) {
      console.error("[API] Failed to create message image:", imageError);
      // Continue even if image insert fails
    }
  }

  // Fetch sender profile for response
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    message: {
      ...message,
      profiles: profile,
      message_images: image ? [{ url: image.url, prompt: image.prompt }] : [],
    },
  });
}
