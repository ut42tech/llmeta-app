import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";
import { Button } from "./button";
import { Toaster } from "./sonner";

const meta = {
  title: "UI/Toaster",
  component: Toaster,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToastDemo = ({
  type,
  message,
}: {
  type: "success" | "info" | "warning" | "error" | "loading" | "default";
  message: string;
}) => {
  const showToast = () => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "info":
        toast.info(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "loading":
        toast.loading(message);
        break;
      default:
        toast(message);
    }
  };

  return (
    <Button onClick={showToast} variant="outline">
      Show {type} toast
    </Button>
  );
};

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <ToastDemo type="default" message="This is a default toast" />
    </>
  ),
};

export const Success: Story = {
  render: () => (
    <>
      <Toaster />
      <ToastDemo type="success" message="Operation completed successfully!" />
    </>
  ),
};

export const Info: Story = {
  render: () => (
    <>
      <Toaster />
      <ToastDemo type="info" message="Here's some information for you." />
    </>
  ),
};

export const Warning: Story = {
  render: () => (
    <>
      <Toaster />
      <ToastDemo type="warning" message="Please be careful with this action." />
    </>
  ),
};

export const ErrorToast: Story = {
  render: () => (
    <>
      <Toaster />
      <ToastDemo type="error" message="Something went wrong!" />
    </>
  ),
};

export const Loading: Story = {
  render: () => (
    <>
      <Toaster />
      <ToastDemo type="loading" message="Loading..." />
    </>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <ToastDemo type="default" message="Default toast" />
        <ToastDemo type="success" message="Success toast" />
        <ToastDemo type="info" message="Info toast" />
        <ToastDemo type="warning" message="Warning toast" />
        <ToastDemo type="error" message="Error toast" />
        <ToastDemo type="loading" message="Loading toast" />
      </div>
    </>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast.success("Changes saved", {
            description: "Your changes have been saved successfully.",
          })
        }
      >
        Show toast with description
      </Button>
    </>
  ),
};

export const WithAction: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast("File deleted", {
            action: {
              label: "Undo",
              onClick: () => toast.success("Restored!"),
            },
          })
        }
      >
        Show toast with action
      </Button>
    </>
  ),
};

export const CustomDuration: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast.info("This toast will stay for 10 seconds", {
            duration: 10000,
          })
        }
      >
        Show long duration toast
      </Button>
    </>
  ),
};
