import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CopyIcon, DownloadIcon } from "lucide-react";
import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactClose,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "./artifact";

const meta = {
  title: "AI Elements/Artifact",
  component: Artifact,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Artifact>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Artifact className="w-100">
      <ArtifactHeader>
        <div className="space-y-1">
          <ArtifactTitle>Generated Code</ArtifactTitle>
          <ArtifactDescription>TypeScript component</ArtifactDescription>
        </div>
        <ArtifactActions>
          <ArtifactAction icon={CopyIcon} tooltip="Copy to clipboard" />
          <ArtifactAction icon={DownloadIcon} tooltip="Download file" />
          <ArtifactClose />
        </ArtifactActions>
      </ArtifactHeader>
      <ArtifactContent>
        <pre className="text-sm">
          {`export const Button = () => {
  return <button>Click me</button>
}`}
        </pre>
      </ArtifactContent>
    </Artifact>
  ),
};

export const Simple: Story = {
  render: () => (
    <Artifact className="w-100">
      <ArtifactHeader>
        <ArtifactTitle>Document Preview</ArtifactTitle>
        <ArtifactClose />
      </ArtifactHeader>
      <ArtifactContent>
        <p className="text-muted-foreground text-sm">Preview content here...</p>
      </ArtifactContent>
    </Artifact>
  ),
};
