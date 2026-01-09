import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Standalone component for Storybook (original uses stores)
const ViewToggleButtonPreview = ({
  isFPV,
  label,
  onClick,
}: {
  isFPV: boolean;
  label: string;
  onClick?: () => void;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon-lg"
            variant="outline"
            aria-label={label}
            aria-pressed={isFPV}
            onClick={onClick}
          >
            <Camera />
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6} className="flex items-center gap-2">
          {label}
          <Kbd>V</Kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const meta = {
  title: "HUD/Dock/ViewToggleButton",
  component: ViewToggleButtonPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isFPV: {
      control: "boolean",
      description: "Whether first-person view is active",
    },
    label: {
      control: "text",
      description: "Current view mode label",
    },
    onClick: {
      action: "toggled",
      description: "Called when button is clicked",
    },
  },
} satisfies Meta<typeof ViewToggleButtonPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThirdPerson: Story = {
  args: {
    isFPV: false,
    label: "First Person",
  },
};

export const FirstPerson: Story = {
  args: {
    isFPV: true,
    label: "Third Person",
  },
};

export const Japanese: Story = {
  args: {
    isFPV: false,
    label: "一人称視点",
  },
};
