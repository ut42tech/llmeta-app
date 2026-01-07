import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ViverseAvatar } from "@/types/player";
import { AvatarPicker } from "./AvatarPicker";

const mockAvatars: ViverseAvatar[] = [
  { id: 1, headIconUrl: "https://placehold.co/96x96?text=1", vrmUrl: "" },
  { id: 2, headIconUrl: "https://placehold.co/96x96?text=2", vrmUrl: "" },
  { id: 3, headIconUrl: "https://placehold.co/96x96?text=3", vrmUrl: "" },
  { id: 4, headIconUrl: "https://placehold.co/96x96?text=4", vrmUrl: "" },
  { id: 5, headIconUrl: "https://placehold.co/96x96?text=5", vrmUrl: "" },
  { id: 6, headIconUrl: "https://placehold.co/96x96?text=6", vrmUrl: "" },
  { id: 7, headIconUrl: "https://placehold.co/96x96?text=7", vrmUrl: "" },
  { id: 8, headIconUrl: "https://placehold.co/96x96?text=8", vrmUrl: "" },
];

const meta = {
  title: "HUD/Dock/AvatarPicker",
  component: AvatarPicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-80 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AvatarPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {};

export const Default: Story = {
  args: {
    avatars: mockAvatars,
    selectedId: 1,
    onSelect: noop,
  },
};

export const NoSelection: Story = {
  args: {
    avatars: mockAvatars,
    selectedId: undefined,
    onSelect: noop,
  },
};

export const Disabled: Story = {
  args: {
    avatars: mockAvatars,
    selectedId: 3,
    onSelect: noop,
    disabled: true,
  },
};

export const FewAvatars: Story = {
  args: {
    avatars: mockAvatars.slice(0, 4),
    selectedId: 2,
    onSelect: noop,
  },
};

export const ManyAvatars: Story = {
  args: {
    avatars: [
      ...mockAvatars,
      { id: 9, headIconUrl: "https://placehold.co/96x96?text=9", vrmUrl: "" },
      { id: 10, headIconUrl: "https://placehold.co/96x96?text=10", vrmUrl: "" },
      { id: 11, headIconUrl: "https://placehold.co/96x96?text=11", vrmUrl: "" },
      { id: 12, headIconUrl: "https://placehold.co/96x96?text=12", vrmUrl: "" },
    ],
    selectedId: 5,
    onSelect: noop,
  },
};
