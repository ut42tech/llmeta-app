import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Image } from "./image";

const meta = {
  title: "AI Elements/Image",
  component: Image,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

// Create a simple 1x1 pixel transparent PNG in base64
const transparentPixel =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

// Convert base64 to Uint8Array for the required prop
const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const transparentPixelBytes = base64ToUint8Array(transparentPixel);

export const Default: Story = {
  args: {
    base64: transparentPixel,
    uint8Array: transparentPixelBytes,
    mediaType: "image/png",
    alt: "Generated transparent image",
  },
};

export const WithStyling: Story = {
  args: {
    base64: transparentPixel,
    uint8Array: transparentPixelBytes,
    mediaType: "image/png",
    alt: "A beautiful AI-generated landscape",
    className: "border shadow-lg",
  },
};
