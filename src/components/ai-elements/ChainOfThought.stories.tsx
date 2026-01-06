import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CheckIcon, SearchIcon } from "lucide-react";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "./chain-of-thought";

const meta = {
  title: "AI Elements/ChainOfThought",
  component: ChainOfThought,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: { control: "boolean" },
  },
} satisfies Meta<typeof ChainOfThought>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <ChainOfThought {...args} className="w-125">
      <ChainOfThoughtHeader>Reasoning Process</ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        <ChainOfThoughtStep
          icon={SearchIcon}
          label="Searching for relevant information"
          status="complete"
        >
          <ChainOfThoughtSearchResults>
            <ChainOfThoughtSearchResult>React docs</ChainOfThoughtSearchResult>
            <ChainOfThoughtSearchResult>
              TypeScript handbook
            </ChainOfThoughtSearchResult>
          </ChainOfThoughtSearchResults>
        </ChainOfThoughtStep>
        <ChainOfThoughtStep
          icon={CheckIcon}
          label="Analyzing requirements"
          status="complete"
        />
        <ChainOfThoughtStep
          label="Generating solution"
          status="active"
          description="Working on the implementation..."
        />
      </ChainOfThoughtContent>
    </ChainOfThought>
  ),
};

export const Collapsed: Story = {
  args: {
    defaultOpen: false,
  },
  render: (args) => (
    <ChainOfThought {...args} className="w-125">
      <ChainOfThoughtHeader>View reasoning</ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        <ChainOfThoughtStep label="Step 1" status="complete" />
        <ChainOfThoughtStep label="Step 2" status="complete" />
      </ChainOfThoughtContent>
    </ChainOfThought>
  ),
};
