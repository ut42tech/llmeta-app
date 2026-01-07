import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ConnectionStatusBadge } from "./ConnectionStatusBadge";

const meta = {
  title: "HUD/StatusBar/ConnectionStatusBadge",
  component: ConnectionStatusBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["idle", "connecting", "connected", "failed", "disconnected"],
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConnectionStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: {
    status: "idle",
  },
};

export const Connecting: Story = {
  args: {
    status: "connecting",
  },
};

export const Connected: Story = {
  args: {
    status: "connected",
  },
};

export const Failed: Story = {
  args: {
    status: "failed",
    error: "Connection timed out",
  },
};

export const Disconnected: Story = {
  args: {
    status: "disconnected",
  },
};

export const AllStates: Story = {
  args: {
    status: "idle",
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-28 text-sm">Idle:</span>
        <ConnectionStatusBadge status="idle" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-28 text-sm">Connecting:</span>
        <ConnectionStatusBadge status="connecting" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-28 text-sm">Connected:</span>
        <ConnectionStatusBadge status="connected" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-28 text-sm">Failed:</span>
        <ConnectionStatusBadge status="failed" error="Connection timed out" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-28 text-sm">Disconnected:</span>
        <ConnectionStatusBadge status="disconnected" />
      </div>
    </div>
  ),
};
