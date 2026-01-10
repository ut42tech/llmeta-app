import { ArrowRight, Clock, User, Users } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import type { Instance } from "@/types";

type InstanceCardProps = {
  instance: Instance;
};

export function InstanceCard({ instance }: InstanceCardProps) {
  const t = useTranslations("instance");
  const format = useFormatter();

  const createdAt = new Date(instance.created_at);
  const formattedDate = format.relativeTime(createdAt, new Date());

  return (
    <Link href={`/instance/${instance.id}`} className="block">
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="group cursor-pointer border-border/50 transition-colors hover:border-border hover:bg-muted/20">
          <div className="flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium">{instance.name}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-sm">
                <div className="flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  <span>— / {instance.max_players}</span>
                </div>
                {instance.hostName && (
                  <div className="flex items-center gap-1.5">
                    <User className="size-3.5" />
                    <span className="truncate">{instance.hostName}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 text-muted-foreground text-sm transition-colors group-hover:text-primary">
              <span className="font-medium">{t("join")}</span>
              <motion.div
                className="flex items-center"
                initial={{ x: 0 }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
