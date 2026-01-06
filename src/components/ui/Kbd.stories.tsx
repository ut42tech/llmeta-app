import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Kbd } from "./kbd";

const meta = {
  title: "UI/Kbd",
  component: Kbd,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "⌘",
  },
};

export const Combinations: Story = {
  render: () => (
    <div className="flex items-center gap-1">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </div>
  ),
};

export const LongText: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Kbd>Ctrl</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>Enter</Kbd>
    </div>
  ),
};
