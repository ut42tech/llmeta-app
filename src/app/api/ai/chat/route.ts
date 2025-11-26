import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  gateway,
  experimental_generateImage as generateImage,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";

export const maxDuration = 120;

type ChatHistoryMessage = {
  id: string;
  sessionId: string;
  username?: string;
  content: string;
  direction: "incoming" | "outgoing" | "system";
  sentAt: number;
};

function formatChatHistory(chatHistory: ChatHistoryMessage[]): string {
  if (!chatHistory || chatHistory.length === 0) {
    return "";
  }

  const formattedMessages = chatHistory.map((msg) => {
    const time = new Date(msg.sentAt).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    const sender = msg.username || "Anonymous";
    const directionLabel =
      msg.direction === "outgoing" ? "(me)" : "(other user)";
    return `[${time}] ${sender} ${directionLabel}: ${msg.content}`;
  });

  return formattedMessages.join("\n");
}

function buildSystemPrompt(chatHistory?: ChatHistoryMessage[]): string {
  const basePrompt = `You are an AI assistant that helps users with their questions and requests. Please provide clear and helpful responses.

You have access to an image generation tool. Use it when:
- The user explicitly asks to generate, create, or draw an image
- The user wants to visualize something from the conversation
- Creating a visual would significantly enhance your response
- The conversation context suggests an image would be helpful

When generating images, create prompts that are:
- Detailed and descriptive
- Based on the conversation context when relevant
- Safe and appropriate`;

  if (!chatHistory || chatHistory.length === 0) {
    return basePrompt;
  }

  const formattedHistory = formatChatHistory(chatHistory);

  return `${basePrompt}

## User Chat History (Context)
Below is the text chat history between users. If the user asks about this chat content, please refer to this history to provide answers.
If asked to summarize or explain the conversation, please respond based on this history.
You can also generate images that visualize or relate to the conversation content when appropriate.

---
${formattedHistory}
---

When the user asks about the chat history:
- Consider the flow and context of the conversation when responding
- Provide summaries or explanations of the conversation as needed
- If there are misunderstandings or miscommunications, point them out and suggest solutions
- Be mindful of privacy and organize information appropriately
- When asked to visualize something from the chat, use the image generation tool with context-appropriate prompts`;
}

const imageGenerationTool = tool({
  description:
    "Generate an image based on a text prompt. Use this when the user asks for an image or when visualizing something would enhance the response. Create detailed prompts that capture the essence of what should be visualized.",
  inputSchema: z.object({
    prompt: z
      .string()
      .describe(
        "A detailed description of the image to generate. Be specific about style, composition, colors, and mood.",
      ),
  }),
  execute: async ({ prompt }) => {
    const { image } = await generateImage({
      model: openai.image("dall-e-3"),
      prompt,
      size: "1024x1024",
    });

    return {
      image: image.base64,
      mediaType: "image/png",
      prompt,
    };
  },
});

export async function POST(req: Request) {
  const {
    messages,
    chatHistory,
  }: { messages: UIMessage[]; chatHistory?: ChatHistoryMessage[] } =
    await req.json();

  const result = streamText({
    model: gateway("openai/gpt-4o-mini"),
    messages: convertToModelMessages(messages),
    system: buildSystemPrompt(chatHistory),
    tools: {
      generateImage: imageGenerationTool,
    },
  });

  return result.toUIMessageStreamResponse();
}
