import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AIChatWelcome } from "./AIChatWelcome";

const noop = () => {};

const meta = {
  title: "HUD/AIChat/AIChatWelcome",
  component: AIChatWelcome,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    username: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="h-[500px] w-[600px] border bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AIChatWelcome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    username: "John",
    onSuggestion: noop,
  },
};

export const WithoutUsername: Story = {
  args: {
    username: undefined,
    onSuggestion: noop,
  },
};

export const LongUsername: Story = {
  args: {
    username: "VeryLongUsernameHere",
    onSuggestion: noop,
  },
};
