import { useTranslations } from "next-intl";
import { navItems } from "@/lib/nav";

export function SiteFooter() {
  const t = useTranslations();

  return (
    <footer className="border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="dim-line mb-8 text-brass">
          <span>{t("footer.specLabel")}</span>
        </div>

        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-display text-lg">{t("footer.tagline")}</p>
            <p className="mt-2 max-w-sm text-sm text-paper/60">
              {t("footer.description")}
            </p>
          </div>

          <ul className="space-y-2 font-mono text-xs uppercase tracking-wide text-paper/70">
            {navItems.map((item) => (
              <li key={item.href}>
                <span className="text-brass">{item.index}</span>{" "}
                {t(`nav.${item.key}.label`)}
              </li>
            ))}
          </ul>

          <ul className="space-y-2 text-sm text-paper/70">
            <li>{t("footer.phone")}</li>
            <li>{t("footer.email")}</li>
            <li>{t("footer.address")}</li>
          </ul>
        </div>

        <p className="mt-10 font-mono text-[0.65rem] text-paper/40">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
