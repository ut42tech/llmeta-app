import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../ui/button";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "./model-selector";

const meta = {
  title: "AI Elements/ModelSelector",
  component: ModelSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ModelSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ModelSelector>
      <ModelSelectorTrigger asChild>
        <Button variant="outline">Select Model</Button>
      </ModelSelectorTrigger>
      <ModelSelectorContent title="Choose AI Model">
        <ModelSelectorInput placeholder="Search models..." />
        <ModelSelectorList>
          <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
          <ModelSelectorGroup heading="OpenAI">
            <ModelSelectorItem>
              <ModelSelectorLogoGroup>
                <ModelSelectorLogo provider="openai" />
              </ModelSelectorLogoGroup>
              <ModelSelectorName>GPT-4o</ModelSelectorName>
            </ModelSelectorItem>
            <ModelSelectorItem>
              <ModelSelectorLogoGroup>
                <ModelSelectorLogo provider="openai" />
              </ModelSelectorLogoGroup>
              <ModelSelectorName>GPT-4o-mini</ModelSelectorName>
            </ModelSelectorItem>
          </ModelSelectorGroup>
          <ModelSelectorGroup heading="Anthropic">
            <ModelSelectorItem>
              <ModelSelectorLogoGroup>
                <ModelSelectorLogo provider="anthropic" />
              </ModelSelectorLogoGroup>
              <ModelSelectorName>Claude 3.5 Sonnet</ModelSelectorName>
            </ModelSelectorItem>
          </ModelSelectorGroup>
          <ModelSelectorGroup heading="Google">
            <ModelSelectorItem>
              <ModelSelectorLogoGroup>
                <ModelSelectorLogo provider="google" />
              </ModelSelectorLogoGroup>
              <ModelSelectorName>Gemini 2.0 Flash</ModelSelectorName>
            </ModelSelectorItem>
          </ModelSelectorGroup>
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  ),
};
