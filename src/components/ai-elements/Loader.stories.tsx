import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Loader } from "./loader";

const meta = {
  title: "AI Elements/Loader",
  component: Loader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "number", min: 12, max: 48, step: 4 } },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 16,
  },
};

export const Small: Story = {
  args: {
    size: 12,
  },
};

export const Large: Story = {
  args: {
    size: 32,
  },
};

export const WithText: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Loader {...args} />
      <span>Loading...</span>
    </div>
  ),
  args: {
    size: 16,
  },
};
