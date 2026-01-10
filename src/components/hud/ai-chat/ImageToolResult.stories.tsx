import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ImageToolPart } from "@/types";
import { ImageToolResult } from "./ImageToolResult";

const noop = () => {};

const loadingToolPart: ImageToolPart = {
  type: "image-generation",
  toolCallId: "tool-1",
  state: "input-streaming",
  input: { prompt: "A beautiful sunset over the ocean" },
};

const inputAvailableToolPart: ImageToolPart = {
  type: "image-generation",
  toolCallId: "tool-2",
  state: "input-available",
  input: { prompt: "A futuristic cityscape with flying cars" },
};

const successToolPart: ImageToolPart = {
  type: "image-generation",
  toolCallId: "tool-3",
  state: "output-available",
  input: { prompt: "A cute cat playing with yarn" },
  output: {
    imageUrl: "https://placehold.co/512x512?text=Generated+Image",
    prompt: "A cute cat playing with yarn",
  },
};

const errorToolPart: ImageToolPart = {
  type: "image-generation",
  toolCallId: "tool-4",
  state: "output-error",
  input: { prompt: "Something that failed" },
  errorText: "Failed to generate image: Rate limit exceeded",
};

const meta = {
  title: "HUD/AIChat/ImageToolResult",
  component: ImageToolResult,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isStreaming: { control: "boolean" },
    canSendToChat: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ImageToolResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    toolPart: loadingToolPart,
    isStreaming: true,
    canSendToChat: false,
    onSendToChat: noop,
    onRefine: noop,
  },
};

export const InputAvailable: Story = {
  args: {
    toolPart: inputAvailableToolPart,
    isStreaming: true,
    canSendToChat: false,
    onSendToChat: noop,
    onRefine: noop,
  },
};

export const Success: Story = {
  args: {
    toolPart: successToolPart,
    isStreaming: false,
    canSendToChat: true,
    onSendToChat: noop,
    onRefine: noop,
  },
};

export const SuccessNoSend: Story = {
  args: {
    toolPart: successToolPart,
    isStreaming: false,
    canSendToChat: false,
    onSendToChat: noop,
    onRefine: noop,
  },
};

export const ErrorState: Story = {
  args: {
    toolPart: errorToolPart,
    isStreaming: false,
    canSendToChat: false,
    onSendToChat: noop,
    onRefine: noop,
  },
};

export const AllStates: Story = {
  args: {
    toolPart: loadingToolPart,
    isStreaming: true,
    canSendToChat: true,
    onSendToChat: noop,
    onRefine: noop,
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-6 p-4">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <div>
        <h3 className="mb-2 font-medium text-sm">Loading:</h3>
        <ImageToolResult
          toolPart={loadingToolPart}
          isStreaming={true}
          canSendToChat={false}
          onSendToChat={noop}
          onRefine={noop}
        />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Success:</h3>
        <ImageToolResult
          toolPart={successToolPart}
          isStreaming={false}
          canSendToChat={true}
          onSendToChat={noop}
          onRefine={noop}
        />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Error:</h3>
        <ImageToolResult
          toolPart={errorToolPart}
          isStreaming={false}
          canSendToChat={false}
          onSendToChat={noop}
          onRefine={noop}
        />
      </div>
    </>
  ),
};
