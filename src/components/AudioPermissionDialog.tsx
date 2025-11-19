"use client";

import { useStartAudio } from "@livekit/components-react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const AudioPermissionDialog = () => {
  const { mergedProps, canPlayAudio } = useStartAudio({
    props: {},
  });

  const open = !canPlayAudio;

  const handleEnableAudio = () => {
    mergedProps.onClick?.();
  };

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 />
            Audio Permission
          </DialogTitle>
          <DialogDescription>
            This app requires audio permission to hear other users. <br />
            Click "Continue" to proceed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={handleEnableAudio}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
