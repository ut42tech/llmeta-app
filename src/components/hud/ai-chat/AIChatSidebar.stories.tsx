import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AIChatSidebar } from "./AIChatSidebar";

const meta = {
  title: "HUD/AIChat/AIChatSidebar",
  component: AIChatSidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    conversations: {
      control: "object",
      description: "List of conversations",
    },
    currentConversationId: {
      control: "text",
      description: "Currently selected conversation ID",
    },
    isLoading: {
      control: "boolean",
      description: "Loading state",
    },
    onSelect: { action: "selected" },
    onCreate: { action: "created" },
    onDelete: { action: "deleted" },
    onRename: { action: "renamed" },
  },
} satisfies Meta<typeof AIChatSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockHandlers = {
  onSelect: (_id: string) => {},
  onCreate: () => {},
  onDelete: (_id: string) => {},
  onRename: (_id: string, _title: string) => {},
};

const mockConversations = [
  {
    id: "conv-1",
    title: "Project Ideas",
    instanceId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user-1",
  },
  {
    id: "conv-2",
    title: "Japanese Translation Help",
    instanceId: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    userId: "user-1",
  },
  {
    id: "conv-3",
    title: "React Component Refactoring",
    instanceId: null,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    userId: "user-1",
  },
  {
    id: "conv-4",
    title: null, // "New Conversation"
    instanceId: null,
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    updatedAt: new Date(Date.now() - 604800000).toISOString(),
    userId: "user-1",
  },
];

export const Default: Story = {
  args: {
    conversations: mockConversations,
    currentConversationId: "conv-1",
    isLoading: false,
    ...mockHandlers,
  },
};

export const Loading: Story = {
  args: {
    conversations: [],
    currentConversationId: null,
    isLoading: true,
    ...mockHandlers,
  },
};

export const Empty: Story = {
  args: {
    conversations: [],
    currentConversationId: null,
    isLoading: false,
    ...mockHandlers,
  },
};

export const ManyConversations: Story = {
  args: {
    conversations: [
      ...mockConversations,
      ...Array.from({ length: 10 }).map((_, i) => ({
        id: `extra-${i}`,
        title: `Older Conversation ${i + 1}`,
        instanceId: null,
        createdAt: new Date(Date.now() - 86400000 * (i + 10)).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * (i + 10)).toISOString(),
        userId: "user-1",
      })),
    ],
    currentConversationId: "conv-1",
    isLoading: false,
    ...mockHandlers,
  },
};
