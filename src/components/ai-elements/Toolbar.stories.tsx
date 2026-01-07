import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReactFlowProvider } from "@xyflow/react";
import { DeleteIcon, EditIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Toolbar } from "./toolbar";

const meta = {
  title: "AI Elements/Toolbar",
  component: Toolbar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Toolbar component that appears above selected nodes in ReactFlow. Provides quick actions for node manipulation. Requires ReactFlowProvider context.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div className="p-8">
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-1 rounded-sm border bg-background p-1.5">
      <Button size="icon-sm" variant="ghost">
        <EditIcon className="size-4" />
      </Button>
      <Button size="icon-sm" variant="ghost">
        <DeleteIcon className="size-4" />
      </Button>
    </div>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <div className="flex items-center gap-1 rounded-sm border bg-background p-1.5">
      <Button size="sm" variant="ghost">
        <EditIcon className="mr-1 size-4" />
        Edit
      </Button>
      <Button size="sm" variant="ghost">
        <DeleteIcon className="mr-1 size-4" />
        Delete
      </Button>
    </div>
  ),
};
