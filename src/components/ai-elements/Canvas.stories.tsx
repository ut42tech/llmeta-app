import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Canvas } from "./canvas";
import { Controls } from "./controls";

const meta = {
  title: "AI Elements/Canvas",
  component: Canvas,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Canvas component wrapping ReactFlow for building node-based workflows and diagrams.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Canvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => (
    <div className="h-[400px] w-full">
      <Canvas nodes={[]} edges={[]}>
        <Controls />
      </Canvas>
    </div>
  ),
};

export const WithNodes: Story = {
  render: () => (
    <div className="h-[400px] w-full">
      <Canvas
        nodes={[
          {
            id: "1",
            position: { x: 100, y: 100 },
            data: { label: "Input Node" },
          },
          {
            id: "2",
            position: { x: 300, y: 100 },
            data: { label: "Output Node" },
          },
        ]}
        edges={[
          {
            id: "e1-2",
            source: "1",
            target: "2",
          },
        ]}
      >
        <Controls />
      </Canvas>
    </div>
  ),
};
