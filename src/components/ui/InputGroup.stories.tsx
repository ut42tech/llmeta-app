import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AtSign, Eye, Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "./input-group";

const meta = {
  title: "UI/InputGroup",
  component: InputGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InputGroup className="w-75">
      <InputGroupAddon align="inline-start">
        <InputGroupText>
          <AtSign />
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="Username" />
    </InputGroup>
  ),
};

export const WithButton: Story = {
  render: () => (
    <InputGroup className="w-75">
      <InputGroupInput type="password" placeholder="Password" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>
          <Eye />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const SearchInput: Story = {
  render: () => (
    <InputGroup className="w-75">
      <InputGroupAddon align="inline-start">
        <InputGroupText>
          <Search />
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
    </InputGroup>
  ),
};

export const BothSides: Story = {
  render: () => (
    <InputGroup className="w-87.5">
      <InputGroupAddon align="inline-start">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="example" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>.com</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};
