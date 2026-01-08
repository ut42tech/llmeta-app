import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar, Globe, Layers, User, Users } from "lucide-react";
import { StatCard } from "./StatCard";

const meta = {
  title: "Common/StatCard",
  component: StatCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: false,
      description: "Lucide icon component",
    },
    label: {
      control: "text",
      description: "Label text displayed above the value",
    },
    value: {
      control: "text",
      description: "Value to display",
    },
    largeValue: {
      control: "boolean",
      description: "Whether to display value in larger text",
    },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: Users,
    label: "Capacity",
    value: "32",
    largeValue: true,
  },
};

export const WithText: Story = {
  args: {
    icon: Globe,
    label: "World",
    value: "Default World",
    largeValue: false,
  },
};

export const WithDate: Story = {
  args: {
    icon: Calendar,
    label: "Created At",
    value: "Jan 8, 2026",
    largeValue: false,
  },
};

export const Host: Story = {
  args: {
    icon: User,
    label: "Host",
    value: "Takuya",
    largeValue: false,
  },
};

export const Instances: Story = {
  args: {
    icon: Layers,
    label: "Instances",
    value: "5",
    largeValue: true,
  },
};

export const Grid: Story = {
  args: {
    icon: Globe,
    label: "World",
    value: "Default World",
  },
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <StatCard icon={Globe} label="World" value="Default World" />
      <StatCard icon={User} label="Host" value="Takuya" />
      <StatCard icon={Users} label="Capacity" value="32" largeValue />
    </div>
  ),
};

export const EmptyValue: Story = {
  args: {
    icon: User,
    label: "Host",
    value: "-",
    largeValue: false,
  },
};
