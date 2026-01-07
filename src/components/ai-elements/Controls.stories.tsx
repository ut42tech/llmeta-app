import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReactFlowProvider } from "@xyflow/react";
import { Controls } from "./controls";

const meta = {
  title: "AI Elements/Controls",
  component: Controls,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Controls component for ReactFlow canvas. Provides zoom in/out and fit view buttons. Requires ReactFlowProvider context.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div className="relative h-50 w-75 rounded-lg border bg-muted/50">
          <p className="absolute top-4 left-4 text-muted-foreground text-xs">
            Canvas area (Controls appear in ReactFlow context)
          </p>
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
} satisfies Meta<typeof Controls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="absolute bottom-4 left-4">
      <div className="flex flex-col gap-px overflow-hidden rounded-md border bg-card p-1">
        <button
          className="rounded-md p-2 hover:bg-secondary"
          title="Zoom In"
          type="button"
        >
          +
        </button>
        <button
          className="rounded-md p-2 hover:bg-secondary"
          title="Zoom Out"
          type="button"
        >
          −
        </button>
        <button
          className="rounded-md p-2 hover:bg-secondary"
          title="Fit View"
          type="button"
        >
          ⊞
        </button>
      </div>
    </div>
  ),
};
