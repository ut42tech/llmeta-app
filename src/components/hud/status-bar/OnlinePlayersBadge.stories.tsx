import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Standalone component for Storybook (original uses stores)
const OnlinePlayersBadgePreview = ({
  count,
  label,
  tooltip,
}: {
  count: number;
  label: string;
  tooltip: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            <span className="tabular-nums">
              {count} {label}
            </span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const meta = {
  title: "HUD/StatusBar/OnlinePlayersBadge",
  component: OnlinePlayersBadgePreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    count: {
      control: { type: "number", min: 1, max: 100 },
      description: "Number of online players",
    },
    label: {
      control: "text",
      description: "Label text (player/players)",
    },
    tooltip: {
      control: "text",
      description: "Tooltip message",
    },
  },
} satisfies Meta<typeof OnlinePlayersBadgePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SinglePlayer: Story = {
  args: {
    count: 1,
    label: "player",
    tooltip: "You are the only player online",
  },
};

export const FewPlayers: Story = {
  args: {
    count: 3,
    label: "players",
    tooltip: "3 players online",
  },
};

export const ManyPlayers: Story = {
  args: {
    count: 24,
    label: "players",
    tooltip: "24 players online",
  },
};

export const Japanese: Story = {
  args: {
    count: 5,
    label: "人",
    tooltip: "5人がオンライン",
  },
};
