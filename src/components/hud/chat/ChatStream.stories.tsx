import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type MockMessage = {
  id: string;
  username: string;
  content: string;
  isOwn: boolean;
};

// Standalone component for Storybook (original uses hooks)
const ChatStreamPreview = ({
  messages,
  emptyTitle,
  emptyDescription,
}: {
  messages: MockMessage[];
  emptyTitle: string;
  emptyDescription: string;
}) => {
  const isEmpty = messages.length === 0;

  return (
    <div className="h-40 w-64 overflow-hidden rounded-xl bg-black/20 p-3 backdrop-blur-sm">
      {isEmpty ? (
        <Empty className="h-full gap-2 border-0 p-0">
          <EmptyMedia variant="icon" className="size-8 bg-white/10">
            <MessageSquare className="size-4 text-white/60" />
          </EmptyMedia>
          <EmptyTitle className="text-white/70 text-xs">
            {emptyTitle}
          </EmptyTitle>
          <EmptyDescription className="text-[10px] text-white/50">
            {emptyDescription}
          </EmptyDescription>
        </Empty>
      ) : (
        <ScrollArea className="h-full w-full">
          <div className="flex w-full flex-col gap-2 pr-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className="fade-in flex items-start gap-2 text-xs"
              >
                <Badge
                  variant={message.isOwn ? "default" : "secondary"}
                  className="h-5 shrink-0 px-1.5 text-[10px]"
                >
                  {message.username}
                </Badge>
                <span
                  className={cn(
                    "text-white/70 leading-5",
                    message.isOwn && "text-white/90",
                  )}
                >
                  {message.content}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

const meta = {
  title: "HUD/Chat/ChatStream",
  component: ChatStreamPreview,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#1a1a1a" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    messages: {
      control: "object",
      description: "Array of chat messages",
    },
    emptyTitle: {
      control: "text",
      description: "Title when no messages",
    },
    emptyDescription: {
      control: "text",
      description: "Description when no messages",
    },
  },
} satisfies Meta<typeof ChatStreamPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyState: Story = {
  args: {
    messages: [],
    emptyTitle: "No messages yet",
    emptyDescription: "Start the conversation!",
  },
};

export const WithMessages: Story = {
  args: {
    messages: [
      { id: "1", username: "Alice", content: "Hello everyone!", isOwn: false },
      { id: "2", username: "You", content: "Hey Alice!", isOwn: true },
      {
        id: "3",
        username: "Bob",
        content: "Welcome to the metaverse!",
        isOwn: false,
      },
    ],
    emptyTitle: "No messages yet",
    emptyDescription: "Start the conversation!",
  },
};

export const ManyMessages: Story = {
  args: {
    messages: [
      { id: "1", username: "Alice", content: "Hello!", isOwn: false },
      { id: "2", username: "Bob", content: "Hi there!", isOwn: false },
      { id: "3", username: "You", content: "Good morning!", isOwn: true },
      {
        id: "4",
        username: "Charlie",
        content: "How is everyone?",
        isOwn: false,
      },
      { id: "5", username: "You", content: "Doing great!", isOwn: true },
      { id: "6", username: "Alice", content: "Same here!", isOwn: false },
    ],
    emptyTitle: "No messages yet",
    emptyDescription: "Start the conversation!",
  },
};

export const Japanese: Story = {
  args: {
    messages: [
      { id: "1", username: "田中", content: "こんにちは！", isOwn: false },
      { id: "2", username: "あなた", content: "こんにちは！", isOwn: true },
    ],
    emptyTitle: "メッセージはまだありません",
    emptyDescription: "会話を始めましょう！",
  },
};
