import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AspectRatio } from "./aspect-ratio";

const meta = {
  title: "UI/AspectRatio",
  component: AspectRatio,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    ratio: { control: { type: "number" } },
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-112.5">
      <AspectRatio ratio={16 / 9}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
          16 / 9
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="w-75">
      <AspectRatio ratio={1}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
          1 / 1
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Portrait: Story = {
  render: () => (
    <div className="w-50">
      <AspectRatio ratio={3 / 4}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
          3 / 4
        </div>
      </AspectRatio>
    </div>
  ),
};
