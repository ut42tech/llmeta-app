import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReactFlowProvider } from "@xyflow/react";
import {
  Node,
  NodeAction,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "./node";

const meta = {
  title: "AI Elements/Node",
  component: Node,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div className="p-4">
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
} satisfies Meta<typeof Node>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    handles: { target: true, source: true },
  },
  render: (args) => (
    <Node {...args}>
      <NodeHeader>
        <div>
          <NodeTitle>AI Node</NodeTitle>
          <NodeDescription>Process data with AI</NodeDescription>
        </div>
        <NodeAction>Edit</NodeAction>
      </NodeHeader>
      <NodeContent>
        <p className="text-sm text-muted-foreground">
          This node represents an AI processing step in a workflow.
        </p>
      </NodeContent>
      <NodeFooter>
        <span className="text-xs text-muted-foreground">Status: Ready</span>
      </NodeFooter>
    </Node>
  ),
};

export const TargetOnly: Story = {
  args: {
    handles: { target: true, source: false },
  },
  render: (args) => (
    <Node {...args}>
      <NodeHeader>
        <NodeTitle>Input Node</NodeTitle>
      </NodeHeader>
      <NodeContent>Receives input data</NodeContent>
    </Node>
  ),
};

export const SourceOnly: Story = {
  args: {
    handles: { target: false, source: true },
  },
  render: (args) => (
    <Node {...args}>
      <NodeHeader>
        <NodeTitle>Output Node</NodeTitle>
      </NodeHeader>
      <NodeContent>Sends output data</NodeContent>
    </Node>
  ),
};
