import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Gamepad2, Globe, Settings } from "lucide-react";
import { motion } from "motion/react";
import { Kbd } from "@/components/ui/kbd";
import {
  SettingsSection,
  staggerContainer,
  staggerItem,
} from "./SettingsShared";

// Mock component for Storybook (avoiding i18n dependencies)
const ControlsTabPreview = () => {
  return (
    <motion.div
      className="w-full max-w-md space-y-6 p-4"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Introduction */}
      <motion.p
        className="text-muted-foreground text-sm leading-relaxed"
        variants={staggerItem}
      >
        Learn about the controls and shortcuts available in the virtual world.
      </motion.p>

      {/* Movement & Camera */}
      <SettingsSection
        title="Movement & Camera"
        icon={<Gamepad2 className="size-4 text-muted-foreground" />}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">WASD</Kbd>
            <span className="text-muted-foreground text-sm">Move around</span>
          </div>
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">Space</Kbd>
            <span className="text-muted-foreground text-sm">Jump</span>
          </div>
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">Shift</Kbd>
            <span className="text-muted-foreground text-sm">Run</span>
          </div>
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">Drag</Kbd>
            <span className="text-muted-foreground text-sm">Look around</span>
          </div>
        </div>
      </SettingsSection>

      {/* Keyboard Shortcuts */}
      <SettingsSection
        title="Keyboard Shortcuts"
        icon={<Settings className="size-4 text-muted-foreground" />}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">V</Kbd>
            <span className="text-muted-foreground text-sm">
              Toggle first/third person view
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">M</Kbd>
            <span className="text-muted-foreground text-sm">
              Toggle microphone
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">P</Kbd>
            <span className="text-muted-foreground text-sm">
              Open preferences
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">/</Kbd>
            <span className="text-muted-foreground text-sm">Open AI chat</span>
          </div>
        </div>
      </SettingsSection>

      {/* Communication */}
      <SettingsSection
        title="Communication"
        icon={<Globe className="size-4 text-muted-foreground" />}
      >
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Use the microphone button in the dock to toggle voice chat. Your
            speech will be transcribed in real-time and shown to other users.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Text chat is available through the chat input at the bottom of the
            screen.
          </p>
        </div>
      </SettingsSection>
    </motion.div>
  );
};

const meta = {
  title: "HUD/Dock/ControlsTab",
  component: ControlsTabPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ControlsTabPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
