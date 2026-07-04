import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/nav";
import { Logo } from "@/components/logo";
import {
  InstagramIcon,
  TelegramIcon,
  WhatsappIcon,
  FacebookIcon,
} from "@/components/icons";
import {
  site,
  telHref,
  mailHref,
  whatsappHref,
  telegramHref,
  instagramHref,
  facebookHref,
} from "@/lib/site";
import type { Locale } from "@/lib/portfolio";

export function SiteFooter() {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  const socials = [
    instagramHref() && { href: instagramHref(), Icon: InstagramIcon, label: "Instagram" },
    telegramHref() && { href: telegramHref(), Icon: TelegramIcon, label: "Telegram" },
    whatsappHref() && { href: whatsappHref(), Icon: WhatsappIcon, label: "WhatsApp" },
    facebookHref() && { href: facebookHref(), Icon: FacebookIcon, label: "Facebook" },
  ].filter(Boolean) as { href: string; Icon: (p: { className?: string }) => React.ReactNode; label: string }[];

  return (
    <footer className="border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="dim-line dim-line-left mb-10 text-brass">
          <span>{t("footer.specLabel")}</span>
        </div>

        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <Logo className="[&_span]:text-paper" markClassName="h-7 w-7 text-brass" />
            <p className="mt-4 font-display text-lg text-paper">
              {t("footer.tagline")}
            </p>
            <p className="mt-2 max-w-sm text-sm text-paper/60">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4 text-paper/40">{t("footer.navLabel")}</p>
            <ul className="space-y-2 font-mono text-xs uppercase tracking-wide">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-paper/70 transition-colors hover:text-brass"
                  >
                    <span className="text-brass">{item.index}</span>{" "}
                    {t(`nav.${item.key}.label`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4 text-paper/40">{t("footer.contactLabel")}</p>
            <ul className="space-y-2 text-sm text-paper/70">
              <li>
                <a href={telHref} className="transition-colors hover:text-brass">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={mailHref} className="transition-colors hover:text-brass">
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brass"
                >
                  {site.address[locale]}
                </a>
              </li>
            </ul>

            {socials.length > 0 && (
              <>
                <p className="eyebrow mb-3 mt-6 text-paper/40">
                  {t("footer.followLabel")}
                </p>
                <div className="flex gap-3">
                  {socials.map(({ href, Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center border border-paper/20 text-paper/70 transition-colors hover:border-brass hover:text-brass"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <p className="mt-12 font-mono text-[0.65rem] text-paper/40">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
