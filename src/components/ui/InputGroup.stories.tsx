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
    <InputGroup className="w-[300px]">
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
    <InputGroup className="w-[300px]">
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
    <InputGroup className="w-[300px]">
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
    <InputGroup className="w-[350px]">
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
