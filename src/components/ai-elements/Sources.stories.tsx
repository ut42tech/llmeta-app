import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Source, Sources, SourcesContent, SourcesTrigger } from "./sources";

const meta = {
  title: "AI Elements/Sources",
  component: Sources,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Sources>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sources>
      <SourcesTrigger count={3} />
      <SourcesContent>
        <Source href="https://example.com/doc1" title="Documentation Page 1" />
        <Source href="https://example.com/doc2" title="API Reference" />
        <Source href="https://example.com/doc3" title="Getting Started Guide" />
      </SourcesContent>
    </Sources>
  ),
};

export const SingleSource: Story = {
  render: () => (
    <Sources>
      <SourcesTrigger count={1} />
      <SourcesContent>
        <Source href="https://example.com/doc" title="Main Documentation" />
      </SourcesContent>
    </Sources>
  ),
};
