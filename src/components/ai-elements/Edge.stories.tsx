import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * Edge components for ReactFlow canvas.
 *
 * The Edge module exports two edge types:
 * - **Temporary**: A dashed bezier edge used while connecting nodes
 * - **Animated**: A solid edge with animated dot traveling along the path
 *
 * These are custom ReactFlow edge types that require the ReactFlow canvas context.
 *
 * @example
 * ```tsx
 * import { Canvas } from "./canvas";
 * import { Edge } from "./edge";
 *
 * <Canvas
 *   edgeTypes={{
 *     temporary: Edge.Temporary,
 *     animated: Edge.Animated,
 *   }}
 *   edges={[
 *     { id: "e1", source: "1", target: "2", type: "animated" }
 *   ]}
 * />
 * ```
 */
const meta = {
  title: "AI Elements/Edge",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Edge components for ReactFlow. Includes Temporary (dashed, for connection preview) and Animated (with moving dot) variants. Must be used within ReactFlow canvas context.",
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
      <h3 className="mb-4 font-semibold text-lg">Edge Types</h3>
      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <h4 className="mb-2 font-medium">Edge.Temporary</h4>
          <p className="mb-2 text-muted-foreground text-sm">
            Dashed bezier edge shown during node connection.
          </p>
          <svg height="60" width="200">
            <title>Temporary Edge</title>
            <path
              d="M10,30 C50,30 150,30 190,30"
              fill="none"
              stroke="var(--color-ring)"
              strokeDasharray="5,5"
              strokeWidth="1"
            />
          </svg>
        </div>
        <div className="rounded-lg border p-4">
          <h4 className="mb-2 font-medium">Edge.Animated</h4>
          <p className="mb-2 text-muted-foreground text-sm">
            Solid edge with animated dot traveling along the path.
          </p>
          <svg height="60" width="200">
            <title>Animated Edge</title>
            <path
              d="M10,30 C50,30 150,30 190,30"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="1"
            />
            <circle fill="var(--color-primary)" r="4">
              <animateMotion
                dur="2s"
                path="M10,30 C50,30 150,30 190,30"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>
    </div>
  ),
};
