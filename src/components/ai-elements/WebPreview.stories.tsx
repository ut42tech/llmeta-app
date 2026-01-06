import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
} from "lucide-react";
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from "./web-preview";

const meta = {
  title: "AI Elements/WebPreview",
  component: WebPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WebPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WebPreview className="h-125 w-175" defaultUrl="https://example.com">
      <WebPreviewNavigation>
        <WebPreviewNavigationButton tooltip="Back">
          <ArrowLeftIcon className="size-4" />
        </WebPreviewNavigationButton>
        <WebPreviewNavigationButton tooltip="Forward">
          <ArrowRightIcon className="size-4" />
        </WebPreviewNavigationButton>
        <WebPreviewNavigationButton tooltip="Refresh">
          <RefreshCwIcon className="size-4" />
        </WebPreviewNavigationButton>
        <WebPreviewUrl />
        <WebPreviewNavigationButton tooltip="Open in new tab">
          <ExternalLinkIcon className="size-4" />
        </WebPreviewNavigationButton>
      </WebPreviewNavigation>
      <WebPreviewBody />
      <WebPreviewConsole
        logs={[
          { level: "log", message: "Page loaded", timestamp: new Date() },
          {
            level: "warn",
            message: "Deprecation warning",
            timestamp: new Date(),
          },
        ]}
      />
    </WebPreview>
  ),
};

export const Empty: Story = {
  render: () => (
    <WebPreview className="h-75 w-125">
      <WebPreviewNavigation>
        <WebPreviewNavigationButton tooltip="Back" disabled>
          <ArrowLeftIcon className="size-4" />
        </WebPreviewNavigationButton>
        <WebPreviewNavigationButton tooltip="Forward" disabled>
          <ArrowRightIcon className="size-4" />
        </WebPreviewNavigationButton>
        <WebPreviewUrl />
      </WebPreviewNavigation>
      <WebPreviewBody />
    </WebPreview>
  ),
};
