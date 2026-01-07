import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Task, TaskContent, TaskItem, TaskItemFile, TaskTrigger } from "./task";

const meta = {
  title: "AI Elements/Task",
  component: Task,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: { control: "boolean" },
  },
} satisfies Meta<typeof Task>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Task {...args} className="w-100">
      <TaskTrigger title="Searching for relevant files..." />
      <TaskContent>
        <TaskItem>
          Found 3 relevant files:
          <div className="mt-2 flex flex-wrap gap-2">
            <TaskItemFile>src/components/Button.tsx</TaskItemFile>
            <TaskItemFile>src/hooks/useButton.ts</TaskItemFile>
            <TaskItemFile>src/styles/button.css</TaskItemFile>
          </div>
        </TaskItem>
      </TaskContent>
    </Task>
  ),
};

export const Collapsed: Story = {
  args: {
    defaultOpen: false,
  },
  render: (args) => (
    <Task {...args} className="w-100">
      <TaskTrigger title="Searching for relevant files..." />
      <TaskContent>
        <TaskItem>Collapsed content</TaskItem>
      </TaskContent>
    </Task>
  ),
};

export const MultipleItems: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Task {...args} className="w-100">
      <TaskTrigger title="Analyzing codebase..." />
      <TaskContent>
        <TaskItem>Reading package.json</TaskItem>
        <TaskItem>Scanning src directory</TaskItem>
        <TaskItem>Analyzing dependencies</TaskItem>
        <TaskItem>
          <div className="flex flex-wrap gap-2">
            <TaskItemFile>package.json</TaskItemFile>
            <TaskItemFile>tsconfig.json</TaskItemFile>
          </div>
        </TaskItem>
      </TaskContent>
    </Task>
  ),
};
