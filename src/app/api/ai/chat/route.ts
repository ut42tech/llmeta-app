import {
  convertToModelMessages,
  gateway,
  streamText,
  type UIMessage,
} from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: gateway("openai/gpt-4o-mini"),
    messages: convertToModelMessages(messages),
    system: `You are an AI Agent that helps users with their questions and requests.`,
  });

  return result.toUIMessageStreamResponse();
}
