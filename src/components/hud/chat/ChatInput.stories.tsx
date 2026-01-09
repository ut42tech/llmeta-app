import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Standalone component for Storybook (original uses hooks)
const ChatInputPreview = ({
  value,
  placeholder,
  sendLabel,
  disabled,
  onSubmit,
  onChange,
}: {
  value: string;
  placeholder: string;
  sendLabel: string;
  disabled: boolean;
  onSubmit?: () => void;
  onChange?: (value: string) => void;
}) => {
  return (
    <TooltipProvider>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
        className="flex w-64 items-center gap-2"
      >
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="h-11 flex-1 rounded-full border-0 bg-black/20 px-4 text-sm text-white backdrop-blur-sm placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/30"
          maxLength={500}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="submit"
              disabled={disabled || !value.trim()}
              size="icon-lg"
              className="rounded-full"
              aria-label={sendLabel}
            >
              <ArrowUp className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={6} className="flex items-center gap-2">
            {sendLabel}
            <Kbd>Enter</Kbd>
          </TooltipContent>
        </Tooltip>
      </form>
    </TooltipProvider>
  );
};

const meta = {
  title: "HUD/Chat/ChatInput",
  component: ChatInputPreview,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#1a1a1a" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Current input value",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    sendLabel: {
      control: "text",
      description: "Send button aria-label",
    },
    disabled: {
      control: "boolean",
      description: "Whether input is disabled",
    },
    onSubmit: {
      action: "submit",
    },
    onChange: {
      action: "change",
    },
  },
} satisfies Meta<typeof ChatInputPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    value: "",
    placeholder: "Type a message...",
    sendLabel: "Send",
    disabled: false,
  },
};

export const WithText: Story = {
  args: {
    value: "Hello everyone!",
    placeholder: "Type a message...",
    sendLabel: "Send",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: "",
    placeholder: "Connecting...",
    sendLabel: "Send",
    disabled: true,
  },
};

export const Japanese: Story = {
  args: {
    value: "こんにちは！",
    placeholder: "メッセージを入力...",
    sendLabel: "送信",
    disabled: false,
  },
};
