"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
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
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const LeaveButton = () => {
  const t = useTranslations("experience");
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLeave = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon-lg"
            variant="outline"
            aria-label={t("leave")}
            onClick={() => setIsDialogOpen(true)}
            className="hover:text-destructive"
          >
            <LogOut />
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>{t("leave")}</TooltipContent>
      </Tooltip>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="size-5 text-destructive" />
              {t("leaveConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("leaveConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("leaveCancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeave}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {t("leaveConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
