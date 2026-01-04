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

const BASE_SYSTEM_PROMPT = `You are an AI assistant that helps users with their questions and requests. Please provide clear and helpful responses.

You have access to an image generation tool. Use it when:
- The user explicitly asks to generate, create, or draw an image
- The user wants to visualize something from the conversation
- Creating a visual would significantly enhance your response
- The conversation context suggests an image would be helpful

When generating images, create prompts that are:
- Detailed and descriptive
- Based on the conversation context when relevant
- Safe and appropriate`;

function formatChatHistory(history: ChatHistoryMessage[]): string {
  return history
    .map((msg) => {
      const time = new Date(msg.sentAt).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
      const sender = msg.username || "Anonymous";
      const label = msg.direction === "outgoing" ? "(me)" : "(other user)";
      return `[${time}] ${sender} ${label}: ${msg.content}`;
    })
    .join("\n");
}

function buildSystemPrompt(chatHistory?: ChatHistoryMessage[]): string {
  if (!chatHistory?.length) return BASE_SYSTEM_PROMPT;

  return `${BASE_SYSTEM_PROMPT}

## User Chat History (Context)
Below is the text chat history between users. If the user asks about this chat content, please refer to this history to provide answers.
If asked to summarize or explain the conversation, please respond based on this history.
You can also generate images that visualize or relate to the conversation content when appropriate.

---
${formatChatHistory(chatHistory)}
---

When the user asks about the chat history:
- Consider the flow and context of the conversation when responding
- Provide summaries or explanations of the conversation as needed
- If there are misunderstandings or miscommunications, point them out and suggest solutions
- Be mindful of privacy and organize information appropriately
- When asked to visualize something from the chat, use the image generation tool with context-appropriate prompts`;
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
  const { message, conversationId, chatHistory }: RequestBody =
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
    system: buildSystemPrompt(chatHistory),
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
