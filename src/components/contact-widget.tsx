"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  site,
  telHref,
  mailHref,
  whatsappHref,
  telegramHref,
} from "@/lib/site";
import {
  WhatsappIcon,
  TelegramIcon,
  PhoneIcon,
  MailIcon,
} from "@/components/icons";

/** Floating quick-contact launcher with real deep links to every channel. */
export function ContactWidget() {
  const t = useTranslations("contact");
  const [open, setOpen] = useState(false);

  const channels = [
    site.whatsapp && {
      href: whatsappHref(),
      label: t("whatsapp"),
      icon: WhatsappIcon,
      external: true,
    },
    site.telegram && {
      href: telegramHref(),
      label: t("telegram"),
      icon: TelegramIcon,
      external: true,
    },
    {
      href: telHref,
      label: `${t("call")} · ${site.phone}`,
      icon: PhoneIcon,
      external: false,
    },
    {
      href: mailHref,
      label: t("email"),
      icon: MailIcon,
      external: false,
    },
  ].filter(Boolean) as {
    href: string;
    label: string;
    icon: (p: { className?: string }) => React.ReactNode;
    external: boolean;
  }[];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      {open && (
        <div className="mb-3 w-72 border border-ink bg-paper shadow-[6px_6px_0_0_var(--color-ink)]">
          <div className="border-b border-ink/10 px-4 py-3">
            <p className="font-mono text-xs uppercase tracking-wide text-ink">
              {t("title")}
            </p>
            <p className="mt-0.5 text-[0.7rem] text-ink/50">{t("subtitle")}</p>
          </div>
          <ul>
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.label} className="border-b border-ink/10 last:border-b-0">
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-ink transition-colors hover:bg-oak/10"
                  >
                    <Icon className="h-5 w-5 text-oak" />
                    {c.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("open")}
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center border border-ink bg-lacquer text-paper shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
      >
        {open ? (
          <span className="text-lg">✕</span>
        ) : (
          <WhatsappIcon className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
