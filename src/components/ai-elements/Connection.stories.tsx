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
    <div className="max-w-lg p-8">
      <h3 className="mb-4 font-semibold text-lg">Connection Line</h3>
      <p className="mb-4 text-muted-foreground text-sm">
        The connection line appears when dragging from a node handle to create a
        new edge. It follows the cursor with a smooth bezier curve.
      </p>
      <div className="rounded-lg border bg-muted/50 p-4">
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
          <text className="fill-muted-foreground text-xs" x="20" y="80">
            Source Handle
          </text>
          <text className="fill-muted-foreground text-xs" x="190" y="80">
            Cursor Position
          </text>
        </svg>
      </div>
    </div>
  ),
};
