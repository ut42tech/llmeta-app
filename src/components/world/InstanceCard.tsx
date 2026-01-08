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
    <Card className="transition-all duration-300 hover:translate-x-1 hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium">{instance.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-muted-foreground text-sm">
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
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
