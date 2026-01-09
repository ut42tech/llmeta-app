import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotFoundCard } from "./NotFoundCard";

const meta = {
  title: "Common/NotFoundCard",
  component: NotFoundCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Title displayed in the card header",
    },
    description: {
      control: "text",
      description: "Description text below the title",
    },
    backHref: {
      control: "text",
      description: "URL to navigate to when clicking the back button",
    },
    backLabel: {
      control: "text",
      description: "Label for the back button",
    },
    containerClassName: {
      control: "text",
      description: "Custom CSS class for the container",
    },
  },
} satisfies Meta<typeof NotFoundCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Page Not Found",
    description: "The page you are looking for does not exist.",
    backLabel: "Back to Home",
    backHref: "/",
    containerClassName: "p-8",
  },
};

export const WorldNotFound: Story = {
  args: {
    title: "World Not Found",
    description:
      "The world you are looking for does not exist or has been deleted.",
    backLabel: "Back to Dashboard",
    backHref: "/",
    containerClassName: "p-8",
  },
};

export const InstanceNotFound: Story = {
  args: {
    title: "Instance Not Found",
    description:
      "This instance may have been closed or is no longer available.",
    backLabel: "Back to World",
    backHref: "/world/default",
    containerClassName: "p-8",
  },
};

export const UserNotFound: Story = {
  args: {
    title: "User Not Found",
    description: "This user profile could not be found.",
    backLabel: "Go Back",
    backHref: "/",
    containerClassName: "p-8",
  },
};

export const Japanese: Story = {
  args: {
    title: "ページが見つかりません",
    description: "お探しのページは存在しません。",
    backLabel: "ホームに戻る",
    backHref: "/",
    containerClassName: "p-8",
  },
};
