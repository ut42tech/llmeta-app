import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Globe } from "lucide-react";
import { motion } from "motion/react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SettingsSection, staggerContainer } from "./SettingsShared";

const languageOptions = [
  { value: "en", label: "English", description: "English" },
  { value: "ja", label: "日本語", description: "Japanese" },
] as const;

// Mock component for Storybook (avoiding store dependencies)
const LanguageTabPreview = ({
  selectedLocale = "en",
}: {
  selectedLocale?: "en" | "ja";
}) => {
  return (
    <motion.div
      className="w-full max-w-md space-y-6 p-4"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <SettingsSection
        title="Select Language"
        icon={<Globe className="size-4 text-muted-foreground" />}
      >
        <RadioGroup value={selectedLocale} onValueChange={() => {}}>
          {languageOptions.map((lang, index) => (
            <motion.div
              key={lang.value}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Label
                htmlFor={`lang-${lang.value}`}
                className="flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50 has-[data-state=checked]:border-primary has-[data-state=checked]:bg-primary/5"
              >
                <RadioGroupItem value={lang.value} id={`lang-${lang.value}`} />
                <div className="flex-1">
                  <div className="font-semibold">{lang.label}</div>
                  <div className="text-muted-foreground text-sm">
                    {lang.description}
                  </div>
                </div>
              </Label>
            </motion.div>
          ))}
        </RadioGroup>
      </SettingsSection>
    </motion.div>
  );
};

const meta = {
  title: "HUD/Dock/LanguageTab",
  component: LanguageTabPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    selectedLocale: {
      control: "radio",
      options: ["en", "ja"],
      description: "Currently selected language",
    },
  },
} satisfies Meta<typeof LanguageTabPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  args: {
    selectedLocale: "en",
  },
};

export const Japanese: Story = {
  args: {
    selectedLocale: "ja",
  },
};
