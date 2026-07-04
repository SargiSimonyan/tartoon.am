import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/nav";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteHeader() {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="shrink-0 font-display text-xl tracking-tight text-ink">
          Tartoon
          <span className="ml-2 align-super font-mono text-[0.6rem] text-oak">
            {t("header.tagline")}
          </span>
        </Link>

        <nav className="hidden gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-baseline gap-1.5 font-mono text-xs uppercase tracking-wide text-ink/70 transition-colors hover:text-lacquer"
            >
              <span className="text-brass">{item.index}</span>
              {t(`nav.${item.key}.label`)}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/order"
            className="hidden border border-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:border-lacquer hover:bg-lacquer hover:text-paper md:inline-block"
          >
            {t("header.cta")}
          </Link>
        </div>
      </div>
    </header>
  );
}
