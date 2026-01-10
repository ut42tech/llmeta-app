"use client";

import { Globe } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useProfileService } from "@/hooks/services";
import type { Locale } from "@/i18n/config";
import { useLanguageStore } from "@/stores";
import { SettingsSection, staggerContainer } from "./SettingsShared";

const languageOptions: { value: Locale; label: string; description: string }[] =
  [
    { value: "en", label: "English", description: "English" },
    { value: "ja", label: "日本語", description: "Japanese" },
  ];

export const LanguageTab = () => {
  const t = useTranslations("language");
  const { updateLanguage } = useProfileService();
  const locale = useLanguageStore((state) => state.locale);

  const handleLocaleChange = async (newLocale: Locale) => {
    await updateLanguage(newLocale);
  };

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <SettingsSection
        title={t("selectLanguage")}
        icon={<Globe className="size-4 text-muted-foreground" />}
      >
        <RadioGroup
          value={locale}
          onValueChange={(v) => handleLocaleChange(v as Locale)}
        >
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
