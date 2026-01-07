import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Shimmer } from "./shimmer";

const meta = {
  title: "AI Elements/Shimmer",
  component: Shimmer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    duration: { control: { type: "number", min: 0.5, max: 5, step: 0.5 } },
    spread: { control: { type: "number", min: 1, max: 5, step: 0.5 } },
    as: {
      control: "select",
      options: ["p", "span", "h1", "h2", "h3"],
    },
  },
} satisfies Meta<typeof Shimmer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Thinking...",
  },
};

export const FastAnimation: Story = {
  args: {
    children: "Loading quickly...",
    duration: 1,
  },
};

export const LongText: Story = {
  args: {
    children: "Processing your request, please wait a moment...",
    duration: 3,
  },
};

export const AsHeading: Story = {
  args: {
    children: "Shimmer Heading",
    as: "h2",
    className: "text-2xl font-bold",
  },
};
