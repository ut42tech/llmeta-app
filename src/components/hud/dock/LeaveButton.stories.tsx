import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Standalone component for Storybook (original uses router)
const LeaveButtonPreview = ({
  isDialogOpen,
  label,
  confirmTitle,
  confirmDescription,
  cancelLabel,
  confirmLabel,
  onOpenDialog,
  onCancel,
  onConfirm,
}: {
  isDialogOpen: boolean;
  label: string;
  confirmTitle: string;
  confirmDescription: string;
  cancelLabel: string;
  confirmLabel: string;
  onOpenDialog?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon-lg"
            variant="outline"
            aria-label={label}
            onClick={onOpenDialog}
            className="hover:text-destructive"
          >
            <LogOut />
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>{label}</TooltipContent>
      </Tooltip>

      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="size-5 text-destructive" />
              {confirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>
              {cancelLabel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

const meta = {
  title: "HUD/Dock/LeaveButton",
  component: LeaveButtonPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isDialogOpen: {
      control: "boolean",
      description: "Whether the confirmation dialog is open",
    },
    label: {
      control: "text",
      description: "Tooltip label",
    },
    confirmTitle: {
      control: "text",
      description: "Dialog title",
    },
    confirmDescription: {
      control: "text",
      description: "Dialog description",
    },
    cancelLabel: {
      control: "text",
      description: "Cancel button label",
    },
    confirmLabel: {
      control: "text",
      description: "Confirm button label",
    },
    onOpenDialog: {
      action: "openDialog",
    },
    onCancel: {
      action: "cancel",
    },
    onConfirm: {
      action: "confirm",
    },
  },
} satisfies Meta<typeof LeaveButtonPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isDialogOpen: false,
    label: "Leave",
    confirmTitle: "Leave Room?",
    confirmDescription: "Are you sure you want to leave this room?",
    cancelLabel: "Cancel",
    confirmLabel: "Leave",
  },
};

export const DialogOpen: Story = {
  args: {
    isDialogOpen: true,
    label: "Leave",
    confirmTitle: "Leave Room?",
    confirmDescription: "Are you sure you want to leave this room?",
    cancelLabel: "Cancel",
    confirmLabel: "Leave",
  },
};

export const Japanese: Story = {
  args: {
    isDialogOpen: true,
    label: "退出",
    confirmTitle: "ルームを退出しますか？",
    confirmDescription: "本当にこのルームから退出しますか？",
    cancelLabel: "キャンセル",
    confirmLabel: "退出",
  },
};
