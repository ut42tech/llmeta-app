import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Fingerprint, Settings, User } from "lucide-react";
import { motion } from "motion/react";
import { InfoRow, SettingsSection, staggerContainer } from "./SettingsShared";

// Wrapper component for demonstrating SettingsSection
const SettingsSectionDemo = ({
  title,
  showIcon,
  content,
}: {
  title: string;
  showIcon: boolean;
  content: string;
}) => {
  return (
    <motion.div
      className="w-full max-w-md space-y-6 p-4"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <SettingsSection
        title={title}
        icon={
          showIcon ? (
            <Settings className="size-4 text-muted-foreground" />
          ) : undefined
        }
      >
        <div className="rounded-xl border bg-muted/30 p-3">
          <p className="text-muted-foreground text-sm">{content}</p>
        </div>
      </SettingsSection>
    </motion.div>
  );
};

// Wrapper component for demonstrating InfoRow
const InfoRowDemo = ({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono: boolean;
}) => {
  return (
    <div className="w-full max-w-md rounded-xl border bg-muted/30 p-4">
      <InfoRow label={label} value={value} mono={mono} />
    </div>
  );
};

// Combined demo showing both components
const SettingsSharedDemo = () => {
  return (
    <motion.div
      className="w-full max-w-md space-y-6 p-4"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <SettingsSection
        title="User Profile"
        icon={<User className="size-4 text-muted-foreground" />}
      >
        <div className="rounded-xl border bg-muted/30 p-3">
          <p className="text-muted-foreground text-sm">
            Configure your user profile settings here.
          </p>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Session Info"
        icon={<Fingerprint className="size-4 text-muted-foreground" />}
      >
        <div className="space-y-2 rounded-xl border bg-muted/30 p-3">
          <InfoRow label="Room Name" value="RM_LOBBY_01" />
          <InfoRow label="Session ID" value="abc123-def456-ghi789" mono />
          <InfoRow label="Status" value="Connected" />
        </div>
      </SettingsSection>
    </motion.div>
  );
};

const meta = {
  title: "HUD/Dock/SettingsShared",
  component: SettingsSharedDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SettingsSharedDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Combined: Story = {};

export const SettingsSectionOnly: Story = {
  render: () => (
    <SettingsSectionDemo
      title="Example Section"
      showIcon={true}
      content="This is an example settings section with an icon."
    />
  ),
};

export const SettingsSectionNoIcon: Story = {
  render: () => (
    <SettingsSectionDemo
      title="Section Without Icon"
      showIcon={false}
      content="This section demonstrates the component without an icon."
    />
  ),
};

export const InfoRowNormal: Story = {
  render: () => <InfoRowDemo label="Status" value="Active" mono={false} />,
};

export const InfoRowMono: Story = {
  render: () => (
    <InfoRowDemo
      label="Session ID"
      value="abc123-def456-ghi789-jkl012"
      mono={true}
    />
  ),
};
