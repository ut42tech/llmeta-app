import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MessageSquareIcon } from "lucide-react";
import { ConversationEmptyState } from "./conversation";

const meta = {
  title: "AI Elements/Conversation",
  component: ConversationEmptyState,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ConversationEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// Note: Conversation and ConversationContent require use-stick-to-bottom context
// We can show ConversationEmptyState independently

export const EmptyState: Story = {
  render: () => (
    <div className="h-75 w-100 border rounded-lg">
      <ConversationEmptyState
        description="Type a message to start chatting"
        icon={<MessageSquareIcon className="size-12" />}
        title="Welcome!"
      />
    </div>
  ),
};

export const CustomEmptyState: Story = {
  render: () => (
    <div className="h-75 w-100 border rounded-lg">
      <ConversationEmptyState
        title="No conversations"
        description="Start a new conversation to begin"
      />
    </div>
  ),
};
