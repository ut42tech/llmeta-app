import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInCursor,
  OpenInLabel,
  OpenInSeparator,
  OpenInTrigger,
  OpenInv0,
} from "./open-in-chat";

const meta = {
  title: "AI Elements/OpenIn",
  component: OpenIn,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OpenIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    query: "How do I create a React component?",
  },
  render: (args) => (
    <OpenIn {...args}>
      <OpenInTrigger />
      <OpenInContent>
        <OpenInLabel>Open in external chat</OpenInLabel>
        <OpenInSeparator />
        <OpenInChatGPT />
        <OpenInClaude />
        <OpenInv0 />
        <OpenInCursor />
      </OpenInContent>
    </OpenIn>
  ),
};

export const WithAllProviders: Story = {
  args: {
    query: "Explain TypeScript generics",
  },
  render: (args) => (
    <OpenIn {...args}>
      <OpenInTrigger />
      <OpenInContent>
        <OpenInLabel>Select a provider</OpenInLabel>
        <OpenInSeparator />
        <OpenInChatGPT />
        <OpenInClaude />
        <OpenInv0 />
        <OpenInCursor />
      </OpenInContent>
    </OpenIn>
  ),
};
