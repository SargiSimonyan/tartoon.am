"use client";

import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

const localeLabels: Record<(typeof routing.locales)[number], string> = {
  ru: "RU",
  en: "EN",
  hy: "ՀԱՅ",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 font-mono text-xs uppercase tracking-wide">
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-ink/20">/</span>}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: l })}
            aria-current={locale === l ? "true" : undefined}
            className={
              locale === l
                ? "text-lacquer"
                : "text-ink/50 transition-colors hover:text-ink"
            }
          >
            {localeLabels[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
