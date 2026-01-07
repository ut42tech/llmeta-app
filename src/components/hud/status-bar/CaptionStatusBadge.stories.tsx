import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CaptionStatusBadge } from "./CaptionStatusBadge";

const meta = {
  title: "HUD/StatusBar/CaptionStatusBadge",
  component: CaptionStatusBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isStreaming: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CaptionStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    isStreaming: true,
  },
};

export const Inactive: Story = {
  args: {
    isStreaming: false,
  },
};

export const AllStates: Story = {
  args: {
    isStreaming: true,
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm">Active:</span>
        <CaptionStatusBadge isStreaming={true} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm">Inactive:</span>
        <CaptionStatusBadge isStreaming={false} />
      </div>
    </div>
  ),
};
