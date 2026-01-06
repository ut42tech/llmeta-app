import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../ui/button";
import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanFooter,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "./plan";

const meta = {
  title: "AI Elements/Plan",
  component: Plan,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isStreaming: { control: "boolean" },
    defaultOpen: { control: "boolean" },
  },
} satisfies Meta<typeof Plan>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultOpen: true,
    isStreaming: false,
  },
  render: (args) => (
    <Plan {...args} className="w-100">
      <PlanHeader>
        <div>
          <PlanTitle>Implementation Plan</PlanTitle>
          <PlanDescription>
            Here is my plan to solve this problem
          </PlanDescription>
        </div>
        <PlanAction>
          <PlanTrigger />
        </PlanAction>
      </PlanHeader>
      <PlanContent>
        <div className="space-y-2 text-sm">
          <p>1. Analyze the requirements</p>
          <p>2. Design the solution</p>
          <p>3. Implement the code</p>
          <p>4. Test and verify</p>
        </div>
      </PlanContent>
      <PlanFooter>
        <Button size="sm">Approve Plan</Button>
      </PlanFooter>
    </Plan>
  ),
};

export const Streaming: Story = {
  args: {
    defaultOpen: true,
    isStreaming: true,
  },
  render: (args) => (
    <Plan {...args} className="w-100">
      <PlanHeader>
        <div>
          <PlanTitle>Creating a plan...</PlanTitle>
          <PlanDescription>Analyzing your request</PlanDescription>
        </div>
        <PlanAction>
          <PlanTrigger />
        </PlanAction>
      </PlanHeader>
      <PlanContent>
        <div className="space-y-2 text-sm">
          <p>1. First step...</p>
        </div>
      </PlanContent>
    </Plan>
  ),
};

export const Collapsed: Story = {
  args: {
    defaultOpen: false,
    isStreaming: false,
  },
  render: (args) => (
    <Plan {...args} className="w-100">
      <PlanHeader>
        <div>
          <PlanTitle>Implementation Plan</PlanTitle>
          <PlanDescription>Click to expand</PlanDescription>
        </div>
        <PlanAction>
          <PlanTrigger />
        </PlanAction>
      </PlanHeader>
      <PlanContent>
        <div className="space-y-2 text-sm">
          <p>Hidden content here...</p>
        </div>
      </PlanContent>
    </Plan>
  ),
};
