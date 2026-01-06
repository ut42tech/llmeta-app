import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FlagIcon } from "lucide-react";
import { TooltipProvider } from "../ui/tooltip";
import { Checkpoint, CheckpointIcon, CheckpointTrigger } from "./checkpoint";

const meta = {
  title: "AI Elements/Checkpoint",
  component: Checkpoint,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Checkpoint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Checkpoint>
      <CheckpointIcon />
      <CheckpointTrigger>Save checkpoint</CheckpointTrigger>
    </Checkpoint>
  ),
};

export const WithTooltip: Story = {
  render: () => (
    <Checkpoint>
      <CheckpointIcon />
      <CheckpointTrigger tooltip="Click to save your current progress">
        Save checkpoint
      </CheckpointTrigger>
    </Checkpoint>
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <Checkpoint>
      <CheckpointIcon>
        <FlagIcon className="size-4 shrink-0" />
      </CheckpointIcon>
      <CheckpointTrigger>Flag this point</CheckpointTrigger>
    </Checkpoint>
  ),
};
