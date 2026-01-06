import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeBlock, CodeBlockCopyButton } from "./code-block";

const meta = {
  title: "AI Elements/CodeBlock",
  component: CodeBlock,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    showLineNumbers: { control: "boolean" },
    language: {
      control: "select",
      options: [
        "typescript",
        "javascript",
        "python",
        "json",
        "bash",
        "html",
        "css",
      ],
    },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCode = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`;

const pythonCode = `def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("World"))`;

const jsonCode = `{
  "name": "example",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0"
  }
}`;

export const TypeScript: Story = {
  args: {
    code: sampleCode,
    language: "typescript",
  },
};

export const WithLineNumbers: Story = {
  args: {
    code: sampleCode,
    language: "typescript",
    showLineNumbers: true,
  },
};

export const Python: Story = {
  args: {
    code: pythonCode,
    language: "python",
  },
};

export const JsonExample: Story = {
  args: {
    code: jsonCode,
    language: "json",
  },
};

export const WithCopyButton: Story = {
  render: (args) => (
    <CodeBlock {...args}>
      <CodeBlockCopyButton />
    </CodeBlock>
  ),
  args: {
    code: sampleCode,
    language: "typescript",
  },
};
