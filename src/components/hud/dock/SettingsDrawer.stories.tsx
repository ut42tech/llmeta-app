import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Fingerprint, Settings, Smile, User } from "lucide-react";
import { AvatarPicker } from "@/components/hud/dock/AvatarPicker";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AVATAR_LIST } from "@/constants/avatars";

// Standalone component for Storybook (mocking the complex SettingsDrawer)
const SettingsDrawerPreview = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className="flex h-150 w-full items-center justify-center bg-background p-4">
      <TooltipProvider>
        <Drawer open={isOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DrawerTrigger asChild>
                <Button size="icon-lg" variant="outline">
                  <Settings />
                </Button>
              </DrawerTrigger>
            </TooltipTrigger>
            <TooltipContent sideOffset={6} className="flex items-center gap-2">
              Settings
              <Kbd>P</Kbd>
            </TooltipContent>
          </Tooltip>

          <DrawerContent className="flex max-h-125 flex-col overflow-hidden">
            <div className="mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden">
              <DrawerHeader className="shrink-0 text-center">
                <DrawerTitle className="flex items-center justify-center gap-2 font-bold text-2xl">
                  <Settings className="size-6" />
                  Settings
                </DrawerTitle>
              </DrawerHeader>

              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 pb-6">
                {/* General Tab Mock */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 font-semibold text-sm">
                    <User className="size-4 text-muted-foreground" />
                    Username
                  </h3>
                  <div className="flex items-center gap-2">
                    <Input value="Takuya" readOnly className="flex-1" />
                    <Button disabled>Update</Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 font-semibold text-sm">
                    <Smile className="size-4 text-muted-foreground" />
                    Avatar
                  </h3>
                  <AvatarPicker
                    avatars={AVATAR_LIST}
                    selectedId={AVATAR_LIST[0].id}
                    onSelect={() => {}}
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 font-semibold text-sm">
                    <Fingerprint className="size-4 text-muted-foreground" />
                    Session Info
                  </h3>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="font-medium text-muted-foreground text-sm">
                      Instance ID
                    </span>
                    <span className="max-w-50 break-all text-right font-mono text-foreground/80 text-xs">
                      inst-123...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </TooltipProvider>
    </div>
  );
};

const meta = {
  title: "HUD/Dock/SettingsDrawer",
  component: SettingsDrawerPreview,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Controls drawer open state",
    },
  },
} satisfies Meta<typeof SettingsDrawerPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
  },
};
