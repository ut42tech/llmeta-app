"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { createClient } from "@/lib/supabase/client";

interface BreadcrumbSegment {
  label: string;
  href?: string;
  isCurrentPage: boolean;
}

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const t = useTranslations("breadcrumb");
  const [worldNames, setWorldNames] = useState<Record<string, string>>({});
  const [instanceNames, setInstanceNames] = useState<Record<string, string>>(
    {},
  );

  // Fetch world and instance names from the pathname
  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const supabase = createClient();

    // Find world and instance IDs in the path
    const worldIndex = pathSegments.indexOf("world");
    const instanceIndex = pathSegments.indexOf("instance");

    const fetchNames = async () => {
      // Fetch world name if world ID exists
      if (worldIndex !== -1 && pathSegments[worldIndex + 1]) {
        const worldId = pathSegments[worldIndex + 1];
        if (isUUID(worldId) && !worldNames[worldId]) {
          const { data } = await supabase
            .from("worlds")
            .select("name")
            .eq("id", worldId)
            .single();

          if (data?.name) {
            setWorldNames((prev) => ({ ...prev, [worldId]: data.name }));
          }
        }
      }

      // Fetch instance name if instance ID exists
      if (instanceIndex !== -1 && pathSegments[instanceIndex + 1]) {
        const instanceId = pathSegments[instanceIndex + 1];
        if (isUUID(instanceId) && !instanceNames[instanceId]) {
          const { data } = await supabase
            .from("instances")
            .select("name")
            .eq("id", instanceId)
            .single();

          if (data?.name) {
            setInstanceNames((prev) => ({ ...prev, [instanceId]: data.name }));
          }
        }
      }
    };

    fetchNames();
  }, [pathname, worldNames, instanceNames]);

  const segments = useMemo((): BreadcrumbSegment[] => {
    // Split pathname and filter empty segments
    const pathSegments = pathname.split("/").filter(Boolean);

    // Always start with home
    const breadcrumbSegments: BreadcrumbSegment[] = [
      {
        label: t("home"),
        href: "/",
        isCurrentPage: pathSegments.length === 0,
      },
    ];

    // Build up the path progressively
    let currentPath = "";

    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentPath += `/${segment}`;
      const isLast = i === pathSegments.length - 1;

      // Get the label for this segment
      let label: string;

      // Check for known route segments
      switch (segment) {
        case "settings":
          label = t("settings");
          break;
        case "world":
          label = t("world");
          break;
        case "instance":
          label = t("instance");
          break;
        default:
          // For dynamic segments (UUIDs, IDs), use actual names or truncated version
          if (isUUID(segment)) {
            // Check if we have a world or instance name for this UUID
            if (worldNames[segment]) {
              label = worldNames[segment];
            } else if (instanceNames[segment]) {
              label = instanceNames[segment];
            } else {
              // If we don't have the name yet, show loading state
              label = t("loading");
            }
          } else {
            // Use the segment as-is but capitalize first letter
            label = segment.charAt(0).toUpperCase() + segment.slice(1);
          }
          break;
      }

      breadcrumbSegments.push({
        label,
        href: isLast ? undefined : currentPath,
        isCurrentPage: isLast,
      });
    }

    return breadcrumbSegments;
  }, [pathname, t, worldNames, instanceNames]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <Fragment key={segment.href ?? segment.label}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {segment.isCurrentPage ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={segment.href}>
                  {segment.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}
