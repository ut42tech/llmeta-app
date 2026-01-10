import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { World } from "@/types";
import { WorldCard } from "./WorldCard";

const mockWorld: World = {
  id: "world-1",
  name: "Fantasy Forest",
  description:
    "A beautiful enchanted forest with magical creatures and hidden treasures. Perfect for exploration and adventure.",
  player_capacity: 50,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

const meta = {
  title: "World/WorldCard",
  component: WorldCard,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WorldCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    world: mockWorld,
    instanceCount: 3,
  },
};

export const LongDescription: Story = {
  args: {
    world: {
      ...mockWorld,
      id: "world-2",
      name: "Cyberpunk Metropolis",
      description:
        "A sprawling futuristic city with neon lights, towering skyscrapers, and advanced technology. Experience the blend of high-tech and urban decay in this immersive cyberpunk environment.",
    },
    instanceCount: 12,
  },
};

export const ShortDescription: Story = {
  args: {
    world: {
      ...mockWorld,
      id: "world-3",
      name: "Cozy Café",
      description: "A relaxing café space.",
      player_capacity: 10,
    },
    instanceCount: 1,
  },
};

export const LongName: Story = {
  args: {
    world: {
      ...mockWorld,
      id: "world-4",
      name: "The Mysterious Ancient Temple of the Lost Civilization",
      description: "Explore ancient ruins and uncover secrets.",
    },
    instanceCount: 0,
  },
};

export const MultipleCards: Story = {
  args: {
    world: mockWorld,
    instanceCount: 3,
  },
  decorators: [
    (Story) => (
      <div className="grid w-200 grid-cols-3 gap-4">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <WorldCard world={mockWorld} instanceCount={5} />
      <WorldCard
        world={{
          ...mockWorld,
          id: "world-2",
          name: "Ocean Paradise",
          description: "Underwater world with coral reefs.",
          player_capacity: 30,
        }}
        instanceCount={2}
      />
      <WorldCard
        world={{
          ...mockWorld,
          id: "world-3",
          name: "Space Station",
          description: "Orbiting station with zero gravity zones.",
          player_capacity: 20,
        }}
        instanceCount={0}
      />
    </>
  ),
};
