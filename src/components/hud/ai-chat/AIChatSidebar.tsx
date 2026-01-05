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
import type { AIConversation } from "@/types/chat";

type AIChatSidebarProps = {
  conversations: AIConversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) {
    return "昨日";
  }
  if (diffDays < 7) {
    return `${diffDays}日前`;
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const ConversationItem = ({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: {
  conversation: AIConversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}) => {
  const t = useTranslations("aiChat");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title ?? "");

  const handleRename = () => {
    if (editTitle.trim()) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
  };

  const title = conversation.title || t("newConversation");

  if (isEditing) {
    return (
      <div className="group relative flex items-center gap-2 rounded-md px-2 py-2 transition-colors bg-accent text-accent-foreground">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename();
            if (e.key === "Escape") {
              setEditTitle(conversation.title ?? "");
              setIsEditing(false);
            }
          }}
          className="h-6 px-1 text-sm"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex w-full items-center gap-2 rounded-md px-2 py-2 transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted/50",
      )}
    >
      <button
        type="button"
        className="flex-1 overflow-hidden text-left"
        onClick={onSelect}
      >
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {formatDate(conversation.updatedAt)}
        </p>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
    <div className="flex h-full w-64 shrink-0 flex-col border-r bg-muted/30">
      <div className="flex shrink-0 items-center justify-between border-b p-3">
        <h3 className="font-medium text-sm">{t("conversations")}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onCreate}
        >
          <MessageSquarePlus className="size-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-2 space-y-1">
          {isLoading ? (
            <>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("noConversations")}
            </div>
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
