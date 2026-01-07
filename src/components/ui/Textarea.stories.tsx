import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Label } from "./label";
import { Textarea } from "./textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here.",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled textarea",
    disabled: true,
  },
};
