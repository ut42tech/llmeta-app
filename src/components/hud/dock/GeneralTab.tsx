"use client";

import { Fingerprint, Smile, User } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { AvatarPicker } from "@/components/hud/dock/AvatarPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AVATAR_LIST } from "@/constants/avatars";
import { useSyncClient } from "@/hooks";
import { useProfileService } from "@/hooks/services";
import { useLocalPlayerStore, useWorldStore } from "@/stores";
import type { ViverseAvatar } from "@/types";
import { InfoRow, SettingsSection, staggerContainer } from "./SettingsShared";

export const GeneralTab = () => {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const { sendProfile } = useSyncClient();
  const { updateDisplayName, updateAvatar } = useProfileService();
  const instanceId = useWorldStore((state) => state.instanceId);

  const {
    username,
    sessionId,
    position,
    rotation,
    setUsername,
    teleport,
    currentAvatar,
    setCurrentAvatar,
  } = useLocalPlayerStore(
    useShallow((state) => ({
      username: state.username || "Anonymous",
      sessionId: state.sessionId || "—",
      position: state.position,
      rotation: state.rotation,
      setUsername: state.setUsername,
      teleport: state.teleport,
      currentAvatar: state.currentAvatar,
      setCurrentAvatar: state.setCurrentAvatar,
    })),
  );

  const [nameInput, setNameInput] = useState(username);

  const isNameChanged = useMemo(
    () => nameInput.trim() !== "" && nameInput.trim() !== username,
    [nameInput, username],
  );

  const handleUpdateName = async () => {
    const newName = nameInput.trim();
    if (!newName) return;
    setUsername(newName);
    sendProfile({ username: newName });
    await updateDisplayName(newName);
  };

  const handleSelectAvatar = async (avatar: ViverseAvatar) => {
    const currentPosition = position.clone();
    const currentRotation = rotation.clone();
    setCurrentAvatar(avatar);
    teleport(currentPosition, currentRotation);
    sendProfile({ avatar });
    await updateAvatar(avatar.id);
  };

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <SettingsSection
        title={t("username")}
        icon={<User className="size-4 text-muted-foreground" />}
      >
        <div className="flex items-center gap-2">
          <Input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder={t("usernamePlaceholder")}
            className="flex-1"
          />
          <Button onClick={handleUpdateName} disabled={!isNameChanged}>
            {tCommon("update")}
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection
        title={t("avatar")}
        icon={<Smile className="size-4 text-muted-foreground" />}
      >
        <AvatarPicker
          avatars={AVATAR_LIST}
          selectedId={currentAvatar?.id}
          onSelect={handleSelectAvatar}
        />
      </SettingsSection>

      <SettingsSection
        title={t("sessionInfo")}
        icon={<Fingerprint className="size-4 text-muted-foreground" />}
      >
        <InfoRow label={t("instanceId")} value={instanceId || "—"} mono />
        <InfoRow label={t("sessionId")} value={sessionId} mono />
      </SettingsSection>
    </motion.div>
  );
};
