import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Instance } from "@/types/world";

type InstanceCardProps = {
  instance: Instance;
};

export function InstanceCard({ instance }: InstanceCardProps) {
  const t = useTranslations("instance");

  return (
    <Card className="group transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{instance.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Users className="size-4" />
              <span>— / {instance.max_players}</span>
              {instance.hostName && (
                <>
                  <span>•</span>
                  <span>{t("hostedBy", { name: instance.hostName })}</span>
                </>
              )}
            </div>
          </div>
          <Link href={`/instance/${instance.id}`}>
            <Button size="sm" className="shrink-0">
              {t("join")}
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
