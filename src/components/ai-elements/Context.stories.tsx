import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Context,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextTrigger,
} from "./context";

const meta = {
  title: "AI Elements/Context",
  component: Context,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Context>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    usedTokens: 5000,
    maxTokens: 128000,
  },
  render: (args) => (
    <Context {...args}>
      <ContextTrigger />
      <ContextContent>
        <ContextContentHeader />
        <ContextContentBody>
          <ContextInputUsage />
          <ContextOutputUsage />
        </ContextContentBody>
        <ContextContentFooter />
      </ContextContent>
    </Context>
  ),
};

export const HighUsage: Story = {
  args: {
    usedTokens: 100000,
    maxTokens: 128000,
  },
  render: (args) => (
    <Context {...args}>
      <ContextTrigger />
      <ContextContent>
        <ContextContentHeader />
        <ContextContentBody>
          <ContextInputUsage />
          <ContextOutputUsage />
        </ContextContentBody>
        <ContextContentFooter />
      </ContextContent>
    </Context>
  ),
};

export const WithModelInfo: Story = {
  args: {
    usedTokens: 15000,
    maxTokens: 128000,
    modelId: "gpt-4o",
  },
  render: (args) => (
    <Context {...args}>
      <ContextTrigger />
      <ContextContent>
        <ContextContentHeader />
        <ContextContentBody>
          <ContextInputUsage />
          <ContextOutputUsage />
        </ContextContentBody>
        <ContextContentFooter />
      </ContextContent>
    </Context>
  ),
};
