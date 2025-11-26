import {
  convertToModelMessages,
  gateway,
  streamText,
  type UIMessage,
} from "ai";

export const maxDuration = 30;

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
  const basePrompt = `You are an AI assistant that helps users with their questions and requests. Please provide clear and helpful responses.`;

  if (!chatHistory || chatHistory.length === 0) {
    return basePrompt;
  }

  const formattedHistory = formatChatHistory(chatHistory);

  return `${basePrompt}

## User Chat History (Context)
Below is the text chat history between users. If the user asks about this chat content, please refer to this history to provide answers.
If asked to summarize or explain the conversation, please respond based on this history.

---
${formattedHistory}
---

When the user asks about the chat history:
- Consider the flow and context of the conversation when responding
- Provide summaries or explanations of the conversation as needed
- If there are misunderstandings or miscommunications, point them out and suggest solutions
- Be mindful of privacy and organize information appropriately`;
}

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
  });

  return result.toUIMessageStreamResponse();
}
