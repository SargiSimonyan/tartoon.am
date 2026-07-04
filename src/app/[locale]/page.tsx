import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/nav";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations();

  return (
    <>
      {/* ---------- HERO: чертёж как тезис страницы ---------- */}
      <section className="blueprint-grid border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <div className="dim-line mb-6 w-fit text-oak">
              <span>{t("home.drawingLabel")}</span>
            </div>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
              {t("home.title1")}
              <br />
              {t("home.title2")}
              <br />
              {t("home.title3")}
            </h1>
            <p className="mt-6 max-w-md text-ink/70">{t("home.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/calculator"
                className="border border-ink bg-ink px-5 py-3 font-mono text-xs uppercase tracking-wide text-paper transition-colors hover:bg-lacquer hover:border-lacquer"
              >
                {t("home.ctaCalculate")}
              </Link>
              <Link
                href="/configurator"
                className="border border-ink px-5 py-3 font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:border-lacquer hover:text-lacquer"
              >
                {t("home.ctaConfigurator")}
              </Link>
            </div>
          </div>

          <HeroBlueprint />
        </div>
      </section>

      {/* ---------- Разделы сайта как спецификация сборки ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="dim-line mb-10 text-oak">
          <span>{t("home.specLabel")}</span>
        </div>

        <div className="grid gap-px overflow-hidden border border-ink/15 bg-ink/15 md:grid-cols-2 lg:grid-cols-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between gap-6 bg-paper p-8 transition-colors hover:bg-oak/10"
            >
              <span className="font-mono text-4xl text-brass/70 transition-colors group-hover:text-lacquer">
                {item.index}
              </span>
              <div>
                <h3 className="font-display text-xl text-ink">
                  {t(`nav.${item.key}.label`)}
                </h3>
                <p className="mt-2 text-sm text-ink/60">
                  {t(`nav.${item.key}.description`)}
                </p>
              </div>
              <span className="font-mono text-xs uppercase tracking-wide text-ink/40 group-hover:text-lacquer">
                {t("home.goto")}
              </span>
            </Link>
          ))}

          <div className="flex flex-col justify-between gap-6 bg-ink p-8 text-paper/70">
            <span className="font-mono text-4xl text-brass/50">06</span>
            <div>
              <h3 className="font-display text-xl text-paper">
                {t("nav.crm.label")}
              </h3>
              <p className="mt-2 text-sm text-paper/50">
                {t("nav.crm.description")}
              </p>
            </div>
            <span className="font-mono text-xs uppercase tracking-wide text-paper/30">
              {t("nav.crm.soon")}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

function HeroBlueprint() {
  return (
    <svg
      viewBox="0 0 420 340"
      className="w-full max-w-md justify-self-center text-ink"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <rect x="80" y="40" width="220" height="240" />
      <line x1="190" y1="40" x2="190" y2="280" />
      <line x1="80" y1="120" x2="190" y2="120" />
      <line x1="80" y1="200" x2="190" y2="200" />
      <rect x="196" y="46" width="98" height="228" strokeDasharray="3 3" />
      <circle cx="284" cy="160" r="2.5" fill="currentColor" />

      <line x1="80" y1="300" x2="300" y2="300" stroke="currentColor" strokeWidth="1" />
      <line x1="80" y1="294" x2="80" y2="306" />
      <line x1="300" y1="294" x2="300" y2="306" />
      <text x="190" y="318" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="currentColor" stroke="none">
        900 mm
      </text>

      <line x1="330" y1="40" x2="330" y2="280" stroke="currentColor" strokeWidth="1" />
      <line x1="324" y1="40" x2="336" y2="40" />
      <line x1="324" y1="280" x2="336" y2="280" />
      <text x="355" y="164" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="currentColor" stroke="none" transform="rotate(90 355 164)">
        2100 mm
      </text>

      <g fontFamily="var(--font-mono)" fontSize="10" fill="currentColor" stroke="none">
        <circle cx="60" cy="80" r="9" stroke="currentColor" strokeWidth="1" fill="var(--color-paper)" />
        <text x="60" y="83" textAnchor="middle">01</text>
        <line x1="69" y1="80" x2="80" y2="90" stroke="currentColor" strokeWidth="0.8" />

        <circle cx="60" cy="240" r="9" stroke="currentColor" strokeWidth="1" fill="var(--color-paper)" />
        <text x="60" y="243" textAnchor="middle">02</text>
        <line x1="69" y1="240" x2="80" y2="230" stroke="currentColor" strokeWidth="0.8" />
      </g>
    </svg>
  );
}
