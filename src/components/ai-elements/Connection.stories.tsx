import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * Connection line component for ReactFlow.
 *
 * This component renders a bezier curve with an endpoint circle
 * while the user is dragging to create a new connection between nodes.
 *
 * @example
 * ```tsx
 * import { Canvas } from "./canvas";
 * import { Connection } from "./connection";
 *
 * <Canvas connectionLineComponent={Connection} />
 * ```
 */
const meta = {
  title: "AI Elements/Connection",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Connection line component displayed when dragging to connect nodes. Shows a bezier curve with a circle endpoint following the cursor.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Documentation: Story = {
  render: () => (
    <div className="p-8 max-w-lg">
      <h3 className="text-lg font-semibold mb-4">Connection Line</h3>
      <p className="text-sm text-muted-foreground mb-4">
        The connection line appears when dragging from a node handle to create a
        new edge. It follows the cursor with a smooth bezier curve.
      </p>
      <div className="border rounded-lg p-4 bg-muted/50">
        <svg height="100" width="250">
          <title>Connection Line</title>
          <path
            d="M20,50 C80,50 170,50 230,50"
            fill="none"
            stroke="var(--color-ring)"
            strokeWidth="1"
          />
          <circle
            cx="230"
            cy="50"
            fill="#fff"
            r="3"
            stroke="var(--color-ring)"
            strokeWidth="1"
          />
          <text className="text-xs fill-muted-foreground" x="20" y="80">
            Source Handle
          </text>
          <text className="text-xs fill-muted-foreground" x="190" y="80">
            Cursor Position
          </text>
        </svg>
      </div>
    </div>
  ),
};
