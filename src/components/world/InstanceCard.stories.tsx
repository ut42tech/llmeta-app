import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Instance } from "@/types";
import { InstanceCard } from "./InstanceCard";

const mockInstance: Instance = {
  id: "instance-1",
  world_id: "world-1",
  name: "Main Lobby",
  max_players: 50,
  host_id: "user-1",
  hostName: "Alice",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  player_count: 0,
};

const meta = {
  title: "World/InstanceCard",
  component: InstanceCard,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InstanceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    instance: mockInstance,
  },
};

export const NoHost: Story = {
  args: {
    instance: {
      ...mockInstance,
      id: "instance-2",
      name: "Public Room",
      hostName: undefined,
    },
  },
};

export const SmallCapacity: Story = {
  args: {
    instance: {
      ...mockInstance,
      id: "instance-3",
      name: "Private Meeting",
      max_players: 5,
      hostName: "Bob",
    },
  },
};

export const LongName: Story = {
  args: {
    instance: {
      ...mockInstance,
      id: "instance-4",
      name: "Super Long Instance Name That Should Be Truncated",
      hostName: "Charlie",
    },
  },
};

export const MultipleInstances: Story = {
  args: {
    instance: mockInstance,
  },
  decorators: [
    (Story) => (
      <div className="flex w-125 flex-col gap-3">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <InstanceCard instance={mockInstance} />
      <InstanceCard
        instance={{
          ...mockInstance,
          id: "instance-2",
          name: "Party Room",
          max_players: 30,
          hostName: "David",
        }}
      />
      <InstanceCard
        instance={{
          ...mockInstance,
          id: "instance-3",
          name: "Quiet Space",
          max_players: 10,
          hostName: undefined,
        }}
      />
    </>
  ),
};
