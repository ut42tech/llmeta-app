"use server";

import type { UIMessage } from "ai";
import { createClient } from "@/lib/supabase/server";
import type { AIConversation, AIStoredMessage } from "@/types/chat";

// =============================================================================
// Types
// =============================================================================

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// =============================================================================
// Helpers
// =============================================================================

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function toUIMessages(messages: AIStoredMessage[]): UIMessage[] {
  return messages.map((m) => ({
    id: m.id,
    role: m.role,
    parts: m.parts as UIMessage["parts"],
  }));
}

// =============================================================================
// Server Actions
// =============================================================================

/**
 * List all conversations for the current user
 */
export async function listConversations(
  instanceId?: string | null,
): Promise<ActionResult<AIConversation[]>> {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  let query = supabase
    .from("ai_conversations")
    .select("id, title, instance_id, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (instanceId) {
    query = query.eq("instance_id", instanceId);
  }

  const { data: conversations, error: err } = await query;

  if (err) {
    return { success: false, error: err.message };
  }

  return {
    success: true,
    data: (conversations ?? []).map((c) => ({
      id: c.id,
      title: c.title,
      instanceId: c.instance_id,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    })),
  };
}

/**
 * Get messages for a specific conversation
 */
export async function getConversationMessages(
  conversationId: string,
): Promise<ActionResult<UIMessage[]>> {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify conversation belongs to user
  const { data: conversation } = await supabase
    .from("ai_conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (!conversation) {
    return { success: true, data: [] };
  }

  const { data: messages, error: err } = await supabase
    .from("ai_messages")
    .select("id, role, parts, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (err) {
    return { success: false, error: err.message };
  }

  return {
    success: true,
    data: toUIMessages(
      messages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant" | "system",
        parts: (m.parts ?? []) as unknown[],
        createdAt: m.created_at,
      })),
    ),
  };
}

/**
 * Create a new conversation
 */
export async function createConversation(
  instanceId?: string | null,
  title?: string,
): Promise<ActionResult<AIConversation>> {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const now = new Date().toISOString();
  const { data: conversation, error: err } = await supabase
    .from("ai_conversations")
    .insert({
      user_id: user.id,
      instance_id: instanceId ?? undefined,
      title: title ?? undefined,
      created_at: now,
      updated_at: now,
    })
    .select("id, title, instance_id, created_at, updated_at")
    .single();

  if (err || !conversation) {
    return {
      success: false,
      error: err?.message ?? "Failed to create conversation",
    };
  }

  return {
    success: true,
    data: {
      id: conversation.id,
      title: conversation.title,
      instanceId: conversation.instance_id,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
    },
  };
}

/**
 * Delete a conversation
 */
export async function deleteConversation(
  conversationId: string,
): Promise<ActionResult<void>> {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Delete messages first
  await supabase
    .from("ai_messages")
    .delete()
    .eq("conversation_id", conversationId);

  // Delete conversation
  const { error: err } = await supabase
    .from("ai_conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", user.id);

  if (err) {
    return { success: false, error: err.message };
  }

  return { success: true, data: undefined };
}

/**
 * Rename a conversation
 */
export async function renameConversation(
  conversationId: string,
  title: string,
): Promise<ActionResult<void>> {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error: err } = await supabase
    .from("ai_conversations")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", conversationId)
    .eq("user_id", user.id);

  if (err) {
    return { success: false, error: err.message };
  }

  return { success: true, data: undefined };
}
