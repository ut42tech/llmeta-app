import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Fingerprint, Smile, User } from "lucide-react";
import { motion } from "motion/react";
import { AvatarPicker } from "@/components/hud/dock/AvatarPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AVATAR_LIST } from "@/constants/avatars";
import { InfoRow, SettingsSection, staggerContainer } from "./SettingsShared";

// Mock component for Storybook (avoiding store dependencies)
const GeneralTabPreview = ({
  username = "Takuya",
  sessionId = "abc123-def456",
  instanceId = "RM_LOBBY_01",
}: {
  username?: string;
  sessionId?: string;
  instanceId?: string;
}) => {
  return (
    <motion.div
      className="w-full max-w-md space-y-6 p-4"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <SettingsSection
        title="Username"
        icon={<User className="size-4 text-muted-foreground" />}
      >
        <div className="flex items-center gap-2">
          <Input
            value={username}
            onChange={() => {}}
            placeholder="Enter your username"
            className="flex-1"
          />
          <Button disabled>Update</Button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Avatar"
        icon={<Smile className="size-4 text-muted-foreground" />}
      >
        <AvatarPicker
          avatars={AVATAR_LIST}
          selectedId={AVATAR_LIST[0].id}
          onSelect={() => {}}
        />
      </SettingsSection>

      <SettingsSection
        title="Session Info"
        icon={<Fingerprint className="size-4 text-muted-foreground" />}
      >
        <div className="space-y-2 rounded-xl border bg-muted/30 p-3">
          <InfoRow label="Room Name" value={instanceId} />
          <InfoRow label="Session ID" value={sessionId} mono />
        </div>
      </SettingsSection>
    </motion.div>
  );
};

const meta = {
  title: "HUD/Dock/GeneralTab",
  component: GeneralTabPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    username: {
      control: "text",
      description: "The display name of the user",
    },
    sessionId: {
      control: "text",
      description: "The current session ID",
    },
    instanceId: {
      control: "text",
      description: "The room/instance name",
    },
  },
} satisfies Meta<typeof GeneralTabPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    username: "Takuya",
    sessionId: "abc123-def456-ghi789",
    instanceId: "RM_LOBBY_01",
  },
};

export const WithLongUsername: Story = {
  args: {
    username: "VeryLongUsernameThatMightOverflow",
    sessionId: "session-12345-67890",
    instanceId: "RM_MAIN_HALL",
  },
};

export const Anonymous: Story = {
  args: {
    username: "Anonymous",
    sessionId: "—",
    instanceId: "—",
  },
};
