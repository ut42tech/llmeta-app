import { type NextRequest, NextResponse } from "next/server";
import type { Json } from "@/types/supabase";
import { requireAuth } from "@/utils/api-auth";

type MessageRole = "user" | "assistant" | "system";

// Helpers
const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

const error = (message: string, status: number) =>
  json({ error: message }, status);

export async function GET(request: NextRequest) {
  const { error: authError, user, supabase } = await requireAuth();
  if (authError) return authError;

  const url = new URL(request.url);
  const conversationId = url.searchParams.get("conversationId");
  const instanceId = url.searchParams.get("instanceId");

  // If conversationId is provided, load that specific conversation with messages
  if (conversationId) {
    const { data: conversation } = await supabase
      .from("ai_conversations")
      .select("id, title, instance_id, created_at, updated_at")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .single();

    if (!conversation) {
      return json({ conversationId: null, messages: [] });
    }

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

  // Otherwise, load all conversations for the user (optionally filtered by instanceId)
  let query = supabase
    .from("ai_conversations")
    .select("id, title, instance_id, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (instanceId) {
    query = query.eq("instance_id", instanceId);
  }

  const { data: conversations, error: err } = await query;

  if (err) return error(err.message, 500);

  return json({
    conversations: (conversations ?? []).map((c) => ({
      id: c.id,
      title: c.title,
      instanceId: c.instance_id,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    })),
  });
}

export async function POST(request: NextRequest) {
  const { error: authError, user, supabase } = await requireAuth();
  if (authError) return authError;

  const { instanceId, title } = (await request.json()) as {
    instanceId?: string;
    title?: string;
  };

  // Create new conversation (always create new, don't check existing)
  const now = new Date().toISOString();
  const { data, error: err } = await supabase
    .from("ai_conversations")
    .insert({
      user_id: user.id,
      instance_id: instanceId,
      title: title,
      created_at: now,
      updated_at: now,
    })
    .select("id, title, instance_id, created_at, updated_at")
    .single();

  if (err) return error(err.message, 500);

  return json({
    conversation: {
      id: data.id,
      title: data.title,
      instanceId: data.instance_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    },
  });
}

// PATCH: Save messages or update conversation
export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as {
    conversationId: string;
    messages?: Array<{
      id: string;
      role: MessageRole;
      parts: Json;
      createdAt?: string;
    }>;
    title?: string;
  };

  const { conversationId, messages, title } = body;

  if (!conversationId) {
    return error("conversationId required", 400);
  }

  const { error: authError, user, supabase } = await requireAuth();
  if (authError) return authError;

  // Verify ownership
  const { data: conv } = await supabase
    .from("ai_conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (!conv) return error("Conversation not found", 404);

  // Update title if provided
  if (title !== undefined) {
    const { error: updateError } = await supabase
      .from("ai_conversations")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    if (updateError) return error(updateError.message, 500);
  }

  // Save messages if provided
  if (messages?.length) {
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

    if (newMessages.length) {
      const { error: err } = await supabase
        .from("ai_messages")
        .insert(newMessages);
      if (err) return error(err.message, 500);

      // Update conversation timestamp
      const { error: touchError } = await supabase
        .from("ai_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

      if (touchError) return error(touchError.message, 500);
    }

    return json({ saved: newMessages.length });
  }

  return json({ success: true });
}

// DELETE: Delete a conversation and its messages
export async function DELETE(request: NextRequest) {
  const { conversationId } = (await request.json()) as {
    conversationId: string;
  };

  if (!conversationId) {
    return error("conversationId required", 400);
  }

  const { error: authError, user, supabase } = await requireAuth();
  if (authError) return authError;

  // Verify ownership
  const { data: conv } = await supabase
    .from("ai_conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (!conv) return error("Conversation not found", 404);

  // Delete messages first (due to foreign key constraint)
  await supabase
    .from("ai_messages")
    .delete()
    .eq("conversation_id", conversationId);

  // Delete conversation
  const { error: err } = await supabase
    .from("ai_conversations")
    .delete()
    .eq("id", conversationId);

  if (err) return error(err.message, 500);

  return json({ success: true });
}
