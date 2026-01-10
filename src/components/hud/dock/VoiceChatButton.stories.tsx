import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Standalone component for Storybook (original uses hooks)
const VoiceChatButtonPreview = ({
  isActive,
  disabled,
  label,
  onClick,
}: {
  isActive: boolean;
  disabled: boolean;
  label: string;
  onClick?: () => void;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon-lg"
            variant={isActive ? "default" : "outline"}
            aria-label={isActive ? "Mute" : "Unmute"}
            aria-pressed={isActive}
            disabled={disabled}
            onClick={onClick}
          >
            {isActive ? <Mic /> : <MicOff />}
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6} className="flex items-center gap-2">
          {label}
          <Kbd>M</Kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const meta = {
  title: "HUD/Dock/VoiceChatButton",
  component: VoiceChatButtonPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isActive: {
      control: "boolean",
      description: "Whether microphone is active",
    },
    disabled: {
      control: "boolean",
      description: "Whether button is disabled",
    },
    label: {
      control: "text",
      description: "Tooltip label text",
    },
    onClick: {
      action: "toggled",
      description: "Called when button is clicked",
    },
  },
} satisfies Meta<typeof VoiceChatButtonPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Muted: Story = {
  args: {
    isActive: false,
    disabled: false,
    label: "Unmute",
  },
};

export const Active: Story = {
  args: {
    isActive: true,
    disabled: false,
    label: "Mute",
  },
};

export const Disabled: Story = {
  args: {
    isActive: false,
    disabled: true,
    label: "Connect to talk",
  },
};

export const PermissionDenied: Story = {
  args: {
    isActive: false,
    disabled: true,
    label: "Permission denied",
  },
};

export const Japanese: Story = {
  args: {
    isActive: false,
    disabled: false,
    label: "ミュート解除",
  },
};

export const Publishing: Story = {
  args: {
    isActive: false,
    disabled: true,
    label: "Connecting...",
  },
};

export const Busy: Story = {
  args: {
    isActive: true,
    disabled: true,
    label: "Disconnecting...",
  },
};
