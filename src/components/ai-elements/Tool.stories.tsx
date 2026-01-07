import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "./tool";

const meta = {
  title: "AI Elements/Tool",
  component: Tool,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tool>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {
  render: () => (
    <Tool className="w-125" defaultOpen>
      <ToolHeader
        state="input-available"
        title="search_files"
        type="tool-invocation"
      />
      <ToolContent>
        <ToolInput input={{ query: "*.tsx", path: "./src" }} />
      </ToolContent>
    </Tool>
  ),
};

export const Completed: Story = {
  render: () => (
    <Tool className="w-125" defaultOpen>
      <ToolHeader
        state="output-available"
        title="read_file"
        type="tool-invocation"
      />
      <ToolContent>
        <ToolInput input={{ path: "./src/index.ts" }} />
        <ToolOutput
          errorText={undefined}
          output={{ content: "export * from './components'", lines: 1 }}
        />
      </ToolContent>
    </Tool>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <Tool className="w-125" defaultOpen>
      <ToolHeader
        state="output-error"
        title="write_file"
        type="tool-invocation"
      />
      <ToolContent>
        <ToolInput input={{ path: "/root/file.txt", content: "data" }} />
        <ToolOutput
          errorText="Permission denied: cannot write to /root/file.txt"
          output={undefined}
        />
      </ToolContent>
    </Tool>
  ),
};

export const AwaitingApproval: Story = {
  render: () => (
    <Tool className="w-125" defaultOpen>
      <ToolHeader
        state="approval-requested"
        title="execute_command"
        type="tool-invocation"
      />
      <ToolContent>
        <ToolInput input={{ command: "npm install" }} />
      </ToolContent>
    </Tool>
  ),
};
