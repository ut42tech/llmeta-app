import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BotMessageSquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Standalone component for Storybook (original uses stores)
const AIChatButtonPreview = ({
  isOpen,
  label,
  tooltipLabel,
  onClick,
}: {
  isOpen: boolean;
  label: string;
  tooltipLabel: string;
  onClick?: () => void;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isOpen ? "default" : "outline"}
            size="lg"
            onClick={onClick}
          >
            <BotMessageSquareIcon />
            {label}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-2">
          {tooltipLabel}
          <Kbd>/</Kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const meta = {
  title: "HUD/Dock/AIChatButton",
  component: AIChatButtonPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Whether the AI chat sidebar is open",
    },
    label: {
      control: "text",
      description: "Button label text",
    },
    tooltipLabel: {
      control: "text",
      description: "Tooltip text",
    },
    onClick: {
      action: "clicked",
      description: "Called when button is clicked",
    },
  },
} satisfies Meta<typeof AIChatButtonPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: {
    isOpen: false,
    label: "Agent",
    tooltipLabel: "AI Agent",
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
    label: "Agent",
    tooltipLabel: "AI Agent",
  },
};

export const Japanese: Story = {
  args: {
    isOpen: false,
    label: "エージェント",
    tooltipLabel: "AIエージェント",
  },
};
