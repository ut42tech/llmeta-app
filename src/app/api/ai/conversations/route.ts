import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/supabase";

type MessageRole = "user" | "assistant" | "system";

// Helpers
const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

const error = (message: string, status: number) =>
  json({ error: message }, status);

const getAuthenticatedUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
};

// GET: Load conversation and messages
export async function GET(request: NextRequest) {
  const instanceId = new URL(request.url).searchParams.get("instanceId");
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) return error("Unauthorized", 401);

  // Find conversation
  const query = supabase
    .from("ai_conversations")
    .select("id")
    .eq("user_id", user.id);

  const { data: conversation } = await (instanceId
    ? query.eq("instance_id", instanceId)
    : query.is("instance_id", null)
  ).single();

  if (!conversation) {
    return json({ conversationId: null, messages: [] });
  }

  // Load messages
  const { data: messages, error: err } = await supabase
    .from("ai_messages")
    .select("id, role, parts, created_at")
    .eq("conversation_id", conversation.id)
    .order("created_at", { ascending: true });

  if (err) return error(err.message, 500);

  return json({
    conversationId: conversation.id,
    messages: messages.map((m) => ({
      id: m.id,
      role: m.role,
      parts: m.parts,
      createdAt: m.created_at,
    })),
  });
}

// POST: Create conversation
export async function POST(request: NextRequest) {
  const { instanceId } = (await request.json()) as { instanceId?: string };
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) return error("Unauthorized", 401);

  // Check existing
  const query = supabase
    .from("ai_conversations")
    .select("id")
    .eq("user_id", user.id);

  const { data: existing } = await (instanceId
    ? query.eq("instance_id", instanceId)
    : query.is("instance_id", null)
  ).single();

  if (existing) return json({ conversationId: existing.id });

  // Create new
  const { data, error: err } = await supabase
    .from("ai_conversations")
    .insert({ user_id: user.id, instance_id: instanceId ?? null })
    .select("id")
    .single();

  if (err) return error(err.message, 500);

  return json({ conversationId: data.id });
}

// PATCH: Save messages
export async function PATCH(request: NextRequest) {
  const { conversationId, messages } = (await request.json()) as {
    conversationId: string;
    messages: Array<{
      id: string;
      role: MessageRole;
      parts: Json;
      createdAt?: string;
    }>;
  };

  if (!conversationId || !messages?.length) {
    return error("conversationId and messages required", 400);
  }

  const { supabase, user } = await getAuthenticatedUser();
  if (!user) return error("Unauthorized", 401);

  // Verify ownership
  const { data: conv } = await supabase
    .from("ai_conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (!conv) return error("Conversation not found", 404);

  // Get existing IDs
  const { data: existing } = await supabase
    .from("ai_messages")
    .select("id")
    .eq("conversation_id", conversationId);

  const existingIds = new Set(existing?.map((m) => m.id) ?? []);

  // Insert only new messages
  const newMessages = messages
    .filter((m) => !existingIds.has(m.id))
    .map((m) => ({
      id: m.id,
      conversation_id: conversationId,
      role: m.role,
      parts: m.parts,
      created_at: m.createdAt ?? new Date().toISOString(),
    }));

  if (!newMessages.length) return json({ saved: 0 });

  const { error: err } = await supabase.from("ai_messages").insert(newMessages);
  if (err) return error(err.message, 500);

  // Update conversation timestamp
  await supabase
    .from("ai_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return json({ saved: newMessages.length });
}
