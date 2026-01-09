import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const locales = ["en", "ja"] as const;
const localeNames = {
  en: "English",
  ja: "日本語",
};

// Standalone component for Storybook (original uses stores)
const LanguageSwitcherPreview = ({
  currentLocale,
  onLocaleChange,
}: {
  currentLocale: "en" | "ja";
  onLocaleChange?: (locale: string) => void;
}) => {
  return (
    <div className="p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Select language">
            <Globe className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {locales.map((loc) => (
            <DropdownMenuItem
              key={loc}
              onClick={() => onLocaleChange?.(loc)}
              className={currentLocale === loc ? "bg-accent" : ""}
            >
              {localeNames[loc]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const meta = {
  title: "Common/LanguageSwitcher",
  component: LanguageSwitcherPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    currentLocale: {
      control: "radio",
      options: ["en", "ja"],
      description: "Current active locale",
    },
    onLocaleChange: {
      action: "localeChanged",
    },
  },
} satisfies Meta<typeof LanguageSwitcherPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  args: {
    currentLocale: "en",
  },
};

export const Japanese: Story = {
  args: {
    currentLocale: "ja",
  },
};
