import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputTextarea,
  PromptInputTools,
} from "./prompt-input";

const meta = {
  title: "AI Elements/PromptInput",
  component: PromptInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PromptInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const handleSubmit = () => {
  console.log("Submitted");
};

export const Default: Story = {
  args: {
    onSubmit: handleSubmit,
  },
  render: (args) => (
    <div className="w-150">
      <PromptInput {...args}>
        <PromptInputBody>
          <PromptInputTextarea placeholder="Type your message..." />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputButton type="submit">Send</PromptInputButton>
          </PromptInputTools>
        </PromptInputFooter>
      </PromptInput>
    </div>
  ),
};

export const WithPlaceholder: Story = {
  args: {
    onSubmit: handleSubmit,
  },
  render: (args) => (
    <div className="w-150">
      <PromptInput {...args}>
        <PromptInputBody>
          <PromptInputTextarea placeholder="Ask me anything about your code..." />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputButton type="submit">Send</PromptInputButton>
          </PromptInputTools>
        </PromptInputFooter>
      </PromptInput>
    </div>
  ),
};
