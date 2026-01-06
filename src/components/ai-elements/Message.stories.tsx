import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  CopyIcon,
  RefreshCwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "./message";

const meta = {
  title: "AI Elements/Message",
  component: Message,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCodeResponse = `Here's how you can create a React component with TypeScript:

\`\`\`tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button = ({ label, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>
}
\`\`\`

This component uses TypeScript interfaces to define the prop types.`;

export const UserMessage: Story = {
  args: {
    from: "user",
  },
  render: (args) => (
    <Message {...args} className="w-150">
      <MessageContent>
        <MessageResponse>
          How do I create a React component with TypeScript?
        </MessageResponse>
      </MessageContent>
    </Message>
  ),
};

export const AssistantMessage: Story = {
  args: {
    from: "assistant",
  },
  render: (args) => (
    <Message {...args} className="w-150">
      <MessageContent>
        <MessageResponse>{sampleCodeResponse}</MessageResponse>
      </MessageContent>
      <MessageActions>
        <MessageAction tooltip="Copy">
          <CopyIcon className="size-4" />
        </MessageAction>
        <MessageAction tooltip="Regenerate">
          <RefreshCwIcon className="size-4" />
        </MessageAction>
        <MessageAction tooltip="Good response">
          <ThumbsUpIcon className="size-4" />
        </MessageAction>
        <MessageAction tooltip="Bad response">
          <ThumbsDownIcon className="size-4" />
        </MessageAction>
      </MessageActions>
    </Message>
  ),
};

export const SystemMessage: Story = {
  args: {
    from: "system",
  },
  render: (args) => (
    <Message {...args} className="w-150">
      <MessageContent>
        <MessageResponse>
          You are a helpful assistant that writes code.
        </MessageResponse>
      </MessageContent>
    </Message>
  ),
};
