"use client";

import {
  HelpCircle,
  ImageIcon,
  MessageCircleQuestion,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================

type Suggestion = {
  id: "summarize" | "explainFlow" | "misunderstandings" | "generateImage";
  icon: React.ReactNode;
};

type AIChatWelcomeProps = {
  username?: string;
  onSuggestion: (text: string) => void;
  className?: string;
};

// =============================================================================
// Constants
// =============================================================================

const SUGGESTIONS: Suggestion[] = [
  {
    id: "summarize",
    icon: <MessageCircleQuestion className="size-4" />,
  },
  {
    id: "explainFlow",
    icon: <Sparkles className="size-4" />,
  },
  {
    id: "misunderstandings",
    icon: <HelpCircle className="size-4" />,
  },
  {
    id: "generateImage",
    icon: <ImageIcon className="size-4" />,
  },
];

// =============================================================================
// Component
// =============================================================================

export const AIChatWelcome = ({
  username,
  onSuggestion,
  className,
}: AIChatWelcomeProps) => {
  const t = useTranslations("aiChat");

  const displayName = username || "Guest";

  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center px-6",
        className,
      )}
    >
      {/* Greeting */}
      <div className="mb-12 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <span className="text-lg text-muted-foreground">
            {t("welcome.greeting", { name: displayName })}
          </span>
        </div>
        <h1 className="font-medium text-3xl tracking-tight md:text-4xl">
          {t("welcome.question")}
        </h1>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {SUGGESTIONS.map((suggestion) => {
          const text = t(`suggestions.${suggestion.id}`);
          return (
            <Button
              key={suggestion.id}
              variant="outline"
              size="lg"
              className="gap-2 rounded-full px-5"
              onClick={() => onSuggestion(text)}
            >
              {suggestion.icon}
              {text}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
