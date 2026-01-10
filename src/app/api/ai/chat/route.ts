import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createIdGenerator,
  gateway,
  generateImage,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { AIContext } from "@/types/ai";
import type { Json } from "@/types/supabase";
import { uploadImageToBlob } from "@/utils/blob";

export const maxDuration = 120;

// =============================================================================
// Types
// =============================================================================

type MessageRole = "user" | "assistant" | "system";

type ChatHistoryMessage = {
  id: string;
  sessionId: string;
  username?: string;
  content: string;
  direction: "incoming" | "outgoing" | "system";
  sentAt: number;
};

type RequestBody = {
  message: UIMessage;
  conversationId?: string;
  chatHistory?: ChatHistoryMessage[];
  context?: AIContext;
};

// =============================================================================
// Database Operations
// =============================================================================

/**
 * Serialize UIMessage part for database storage.
 * Filters out non-essential parts like step-start.
 */
function serializePart(part: UIMessage["parts"][number]): Json | null {
  switch (part.type) {
    case "text":
      return { type: "text", text: part.text };
    case "step-start":
      return null;
    default:
      if (part.type.startsWith("tool-")) {
        const { type, toolCallId, state, input, output } = part as Record<
          string,
          unknown
        >;
        return { type, toolCallId, state, input, output } as Json;
      }
      return null;
  }
}

/** Load all messages for a conversation from database. */
async function loadMessages(conversationId: string): Promise<UIMessage[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("ai_messages")
    .select("id, role, parts")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return (data ?? []).map((m) => ({
    id: m.id,
    role: m.role as UIMessage["role"],
    parts: m.parts as UIMessage["parts"],
  }));
}

/** Save a single user message immediately before streaming. */
async function saveUserMessage(
  conversationId: string,
  message: UIMessage,
): Promise<void> {
  const supabase = await createClient();
  const parts = message.parts.map(serializePart).filter(Boolean) as Json;

  await supabase.from("ai_messages").upsert({
    id: message.id,
    conversation_id: conversationId,
    role: message.role as MessageRole,
    parts,
    created_at: new Date().toISOString(),
  });
}

/** Save all messages after stream completion. */
async function saveAllMessages(
  conversationId: string,
  messages: UIMessage[],
): Promise<void> {
  const supabase = await createClient();

  // Get existing IDs to avoid duplicates
  const { data: existing } = await supabase
    .from("ai_messages")
    .select("id")
    .eq("conversation_id", conversationId);

  const existingIds = new Set(existing?.map((m) => m.id) ?? []);
  const now = new Date().toISOString();

  const newMessages = messages
    .filter((m) => !existingIds.has(m.id))
    .map((m) => ({
      id: m.id,
      conversation_id: conversationId,
      role: m.role as MessageRole,
      parts: m.parts.map(serializePart).filter(Boolean) as Json,
      created_at: now,
    }));

  if (!newMessages.length) return;

  await supabase.from("ai_messages").insert(newMessages);
  await supabase
    .from("ai_conversations")
    .update({ updated_at: now })
    .eq("id", conversationId);
}

// =============================================================================
// System Prompt Builder
// =============================================================================

const BASE_SYSTEM_PROMPT = `You are the user's Personal AI Agent in LLMeta, an AI-powered metaverse platform.
Your primary role is to enhance communication between users in this virtual world.

## Core Capabilities

1. **Contextual Explanations**: When users seem confused or ask about the conversation, provide real-time clarifications based on the chat context.

2. **Summaries**: Condense discussions when asked or when the conversation becomes lengthy. Help users stay aligned on what was discussed.

3. **Image Generation**: Create visuals to support idea sharing. Use this when:
   - The user explicitly requests an image
   - Visualizing would clarify a complex concept being discussed
   - The user expresses difficulty understanding something

4. **Understanding Enhancement**: Watch for potential misunderstandings between users. If you detect confusion, gently offer to clarify.

## Response Style

- Keep responses **concise** — users are multitasking in 3D space
- Use **bullet points** for clarity when listing information
- Be **warm and conversational**, like a helpful companion
- Respond in the **user's language**
- Match the energy of the conversation (casual or serious)

## Image Generation Guidelines

When generating images, create prompts that are:
- Detailed and descriptive
- Based on the conversation context when relevant
- Safe and appropriate`;

function formatChatHistory(history: ChatHistoryMessage[]): string {
  return history
    .map((msg) => {
      const sender = msg.username || "Anonymous";
      const label = msg.direction === "outgoing" ? "(me)" : "(other user)";
      return `[${new Date(msg.sentAt).toISOString()}] ${sender} ${label}: ${msg.content}`;
    })
    .join("\n");
}

function buildSystemPrompt(
  chatHistory?: ChatHistoryMessage[],
  context?: AIContext,
): string {
  let prompt = BASE_SYSTEM_PROMPT;

  if (context?.currentDateTime) {
    prompt += `\n\n## Current Context\nCurrent Time: ${context.currentDateTime}`;
  }

  if (context?.images?.recentImages.length) {
    const images = context.images.recentImages
      .map(
        (img) =>
          `- [${img.createdAt}] ${img.username || "Unknown"}: "${img.prompt}"`,
      )
      .join("\n");
    prompt += `\n\n## Recently Generated Images\n${images}`;
  }

  if (!chatHistory?.length) return prompt;

  return `${prompt}

## User Chat History
Below is the recent text chat between users. Use this context to:
- Answer questions about the conversation
- Provide summaries when requested
- Identify and clarify potential misunderstandings
- Generate context-appropriate images when helpful

---
${formatChatHistory(chatHistory)}
---`;
}

// =============================================================================
// Tools
// =============================================================================

const imageGenerationTool = tool({
  description:
    "Generate an image based on a text prompt. Use this when the user asks for an image or when visualizing something would enhance the response.",
  inputSchema: z.object({
    prompt: z
      .string()
      .describe("A detailed description of the image to generate."),
  }),
  execute: async ({ prompt }) => {
    const { image } = await generateImage({
      model: openai.image("dall-e-3"),
      prompt,
      size: "1024x1024",
    });

    const { url } = await uploadImageToBlob(image.base64, "image/png", prompt);
    return { imageUrl: url, prompt };
  },
});

// =============================================================================
// Route Handler
// =============================================================================

export async function POST(req: Request) {
  const { message, conversationId, chatHistory, context }: RequestBody =
    await req.json();

  // Load previous messages and save user message (if conversation exists)
  let allMessages: UIMessage[] = [message];

  if (conversationId) {
    const [previousMessages] = await Promise.all([
      loadMessages(conversationId),
      saveUserMessage(conversationId, message),
    ]);
    allMessages = [...previousMessages, message];
  }

  // Stream AI response
  const result = streamText({
    model: gateway("openai/gpt-4o-mini"),
    messages: await convertToModelMessages(allMessages),
    system: buildSystemPrompt(chatHistory, context),
    tools: { generateImage: imageGenerationTool },
  });

  // Ensure stream completes even on client disconnect
  result.consumeStream();

  return result.toUIMessageStreamResponse({
    originalMessages: allMessages,
    generateMessageId: createIdGenerator({ prefix: "ai-msg", size: 16 }),
    onFinish: async ({ messages: finalMessages }) => {
      if (!conversationId) return;

      try {
        await saveAllMessages(conversationId, finalMessages);
      } catch (error) {
        console.error("[AI Chat] Failed to save messages:", error);
      }
    },
  });
}
