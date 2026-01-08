import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Label text displayed above the value */
  label: string;
  /** Value to display - can be string, number, or custom ReactNode */
  value: ReactNode;
  /** Whether to display value in larger text (for numeric values) */
  largeValue?: boolean;
}

/**
 * A card component for displaying statistics with an icon, label, and value.
 * Used in world and instance detail pages.
 */
export function StatCard({
  icon: Icon,
  label,
  value,
  largeValue = false,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">{label}</p>
          <div
            className={
              largeValue ? "font-semibold text-xl" : "truncate font-semibold"
            }
          >
            {value}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
