import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReactFlowProvider } from "@xyflow/react";
import { Panel } from "./panel";

const meta = {
  title: "AI Elements/Panel",
  component: Panel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Panel component for ReactFlow. Positions content within the canvas viewport. Requires ReactFlowProvider context.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div className="h-75 w-100 border rounded-lg relative bg-muted/50">
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            Canvas viewport
          </p>
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TopLeft: Story = {
  render: () => (
    <div className="absolute top-4 left-4 m-4 overflow-hidden rounded-md border bg-card p-2">
      <p className="text-sm">Top Left Panel</p>
      <p className="text-xs text-muted-foreground">Panel content here</p>
    </div>
  ),
};

export const BottomRight: Story = {
  render: () => (
    <div className="absolute bottom-4 right-4 m-4 overflow-hidden rounded-md border bg-card p-2">
      <p className="text-sm">Bottom Right Panel</p>
      <p className="text-xs text-muted-foreground">Position: bottom-right</p>
    </div>
  ),
};
