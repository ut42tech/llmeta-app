import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bold, Italic, Underline } from "lucide-react";
import { Toggle } from "./toggle";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Bold className="h-4 w-4" />,
    "aria-label": "Toggle bold",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </Toggle>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <Toggle aria-label="Toggle underline">
      <Underline className="h-4 w-4" />
      Underline
    </Toggle>
  ),
};

export const Disabled: Story = {
  args: {
    children: <Bold className="h-4 w-4" />,
    "aria-label": "Toggle bold",
    disabled: true,
  },
};
