import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Waveform } from "./Waveform";

const meta = {
  title: "HUD/Caption/Waveform",
  component: Waveform,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    barCount: {
      control: { type: "range", min: 3, max: 20, step: 1 },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex h-16 items-center justify-center bg-muted p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Waveform>;

export default meta;
type Story = StoryObj<typeof meta>;

// Waveform in idle state (no track provided)
export const Idle: Story = {
  args: {
    barCount: 10,
  },
};

export const FewBars: Story = {
  args: {
    barCount: 5,
  },
};

export const ManyBars: Story = {
  args: {
    barCount: 15,
  },
};

export const WithCustomClass: Story = {
  args: {
    barCount: 10,
    className: "h-12",
  },
};

export const BarCountComparison: Story = {
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-8 bg-muted p-6">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">5 bars:</span>
        <div className="flex h-8 items-center">
          <Waveform barCount={5} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">10 bars:</span>
        <div className="flex h-8 items-center">
          <Waveform barCount={10} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">15 bars:</span>
        <div className="flex h-8 items-center">
          <Waveform barCount={15} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">20 bars:</span>
        <div className="flex h-8 items-center">
          <Waveform barCount={20} />
        </div>
      </div>
    </>
  ),
};
