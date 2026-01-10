"use client";

import {
  MessageSquarePlus,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AIConversation } from "@/types";

// =============================================================================
// Types
// =============================================================================

type ConversationItemProps = {
  conversation: AIConversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
};

type AIChatSidebarProps = {
  conversations: AIConversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
};

// =============================================================================
// Utils
// =============================================================================

type RelativeDateTranslations = {
  yesterday: string;
  daysAgo: (count: number) => string;
};

const formatRelativeDate = (
  dateString: string,
  translations: RelativeDateTranslations,
) => {
  const date = new Date(dateString);
  const diffDays = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) {
    return translations.yesterday;
  }
  if (diffDays < 7) {
    return translations.daysAgo(diffDays);
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

// =============================================================================
// ConversationItem
// =============================================================================

const ConversationItem = ({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: ConversationItemProps) => {
  const t = useTranslations("aiChat");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title ?? "");

  const title = conversation.title || t("newConversation");

  // Memoize translations for formatRelativeDate
  const relativeDateTranslations: RelativeDateTranslations = {
    yesterday: t("relativeDate.yesterday"),
    daysAgo: (count) => t("relativeDate.daysAgo", { count }),
  };

  const handleRename = () => {
    const trimmed = editTitle.trim();
    if (trimmed) onRename(trimmed);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRename();
    if (e.key === "Escape") {
      setEditTitle(conversation.title ?? "");
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="rounded-lg bg-accent px-2 py-2">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          className="h-6 px-1 text-sm"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group grid grid-cols-[1fr_28px] items-center gap-1 rounded-lg py-2 pr-1 pl-2 transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted/50",
      )}
    >
      <button
        type="button"
        className="overflow-hidden text-left"
        onClick={onSelect}
      >
        <p className="truncate font-medium text-sm">{title}</p>
        <p className="truncate text-muted-foreground text-xs">
          {formatRelativeDate(conversation.updatedAt, relativeDateTranslations)}
        </p>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 size-4" />
            {t("rename")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// =============================================================================
// AIChatSidebar
// =============================================================================

export const AIChatSidebar = ({
  conversations,
  currentConversationId,
  isLoading,
  onSelect,
  onCreate,
  onDelete,
  onRename,
}: AIChatSidebarProps) => {
  const t = useTranslations("aiChat");

  return (
    <div className="flex h-full w-64 shrink-0 flex-col border-r bg-muted/20">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-4">
        <h3 className="font-semibold text-sm">{t("conversations")}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={onCreate}
        >
          <MessageSquarePlus className="size-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-0.5 p-2">
          {isLoading ? (
            <LoadingSkeleton />
          ) : conversations.length === 0 ? (
            <EmptyState message={t("noConversations")} />
          ) : (
            conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === currentConversationId}
                onSelect={() => onSelect(conv.id)}
                onDelete={() => onDelete(conv.id)}
                onRename={(title) => onRename(conv.id, title)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

// =============================================================================
// Sub-components
// =============================================================================

const LoadingSkeleton = () => (
  <div className="space-y-1">
    {[1, 2, 3].map((i) => (
      <Skeleton key={i} className="h-14 w-full rounded-lg" />
    ))}
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center p-6 text-center">
    <MessageSquarePlus className="mb-2 size-8 text-muted-foreground/40" />
    <p className="text-muted-foreground text-sm">{message}</p>
  </div>
);
