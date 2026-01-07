import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Suggestion, Suggestions } from "./suggestion";

const meta = {
  title: "AI Elements/Suggestion",
  component: Suggestion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Suggestion>;

export default meta;
type Story = StoryObj<typeof meta>;

const handleClick = (suggestion: string) => {
  console.log("Clicked:", suggestion);
};

export const Default: Story = {
  args: {
    suggestion: "Tell me more",
    onClick: handleClick,
  },
};

export const MultipleSuggestions: Story = {
  args: {
    suggestion: "Tell me more",
    onClick: handleClick,
  },
  render: (args) => (
    <Suggestions>
      <Suggestion {...args} />
      <Suggestion suggestion="Explain in detail" onClick={handleClick} />
      <Suggestion suggestion="Give an example" onClick={handleClick} />
      <Suggestion suggestion="How does this work?" onClick={handleClick} />
    </Suggestions>
  ),
};

export const CustomVariant: Story = {
  args: {
    suggestion: "Custom styled",
    variant: "secondary",
    onClick: handleClick,
  },
};
