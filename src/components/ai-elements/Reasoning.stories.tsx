import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "./reasoning";

const meta = {
  title: "AI Elements/Reasoning",
  component: Reasoning,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isStreaming: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    duration: { control: { type: "number", min: 1, max: 60 } },
  },
} satisfies Meta<typeof Reasoning>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleReasoning = `Let me think about this step by step:

1. First, I need to understand the problem
2. Then analyze the requirements
3. Finally, propose a solution

Based on my analysis, here's what I found...`;

export const Default: Story = {
  args: {
    defaultOpen: true,
    duration: 5,
  },
  render: (args) => (
    <Reasoning {...args}>
      <ReasoningTrigger />
      <ReasoningContent>{sampleReasoning}</ReasoningContent>
    </Reasoning>
  ),
};

export const Streaming: Story = {
  args: {
    isStreaming: true,
    defaultOpen: true,
  },
  render: (args) => (
    <Reasoning {...args}>
      <ReasoningTrigger />
      <ReasoningContent>{sampleReasoning}</ReasoningContent>
    </Reasoning>
  ),
};

export const Collapsed: Story = {
  args: {
    defaultOpen: false,
    duration: 12,
  },
  render: (args) => (
    <Reasoning {...args}>
      <ReasoningTrigger />
      <ReasoningContent>{sampleReasoning}</ReasoningContent>
    </Reasoning>
  ),
};
