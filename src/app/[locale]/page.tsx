import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/nav";
import { PROJECTS, type Locale } from "@/lib/portfolio";
import { FrontElevation } from "@/components/front-elevation";
import { MATERIALS } from "@/lib/pricing";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const loc = (await getLocale()) as Locale;

  const oak = MATERIALS.find((m) => m.id === "veneer")?.swatch ?? "#a8763e";
  const featured = PROJECTS.slice(0, 3);
  const processSteps = ["step1", "step2", "step3", "step4", "step5"] as const;
  const whyPoints = ["p1", "p2", "p3", "p4"] as const;

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="blueprint-grid border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <div className="dim-line dim-line-left mb-6 w-fit text-oak">
              <span>{t("home.drawingLabel")}</span>
            </div>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
              {t("home.title1")}
              <br />
              {t("home.title2")}
              <br />
              {t("home.title3")}
            </h1>
            <p className="mt-6 max-w-md text-ink/70 md:text-lg">
              {t("home.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/calculator" className="btn btn-primary">
                {t("home.ctaCalculate")}
              </Link>
              <Link href="/configurator" className="btn btn-ghost">
                {t("home.ctaConfigurator")}
              </Link>
            </div>
          </div>

          <div className="aspect-square w-full max-w-md justify-self-center">
            <FrontElevation
              product="wardrobe"
              w={2000}
              h={2400}
              sections={3}
              swatch={oak}
              handles
            />
          </div>
        </div>
      </section>

      {/* ---------- Section specification ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="dim-line dim-line-left mb-10 text-oak">
          <span>{t("home.specLabel")}</span>
        </div>

        <div className="grid gap-px overflow-hidden border border-ink/15 hairline-grid md:grid-cols-2 lg:grid-cols-3">
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
                {t("home.goto")} →
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

      {/* ---------- Process ---------- */}
      <section className="border-y border-ink/10 bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="dim-line dim-line-left mb-3 text-oak">
            <span>{t("home.process.label")}</span>
          </div>
          <h2 className="font-display text-3xl tracking-tight text-ink md:text-4xl">
            {t("home.process.title")}
          </h2>

          <ol className="mt-10 grid gap-px overflow-hidden border border-ink/15 hairline-grid sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <li key={step} className="bg-paper p-6">
                <span className="font-mono text-sm text-brass">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-display text-lg text-ink">
                  {t(`home.process.${step}.title`)}
                </h3>
                <p className="mt-2 text-sm text-ink/60">
                  {t(`home.process.${step}.text`)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Featured work ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="dim-line dim-line-left mb-3 text-oak">
              <span>{t("home.featured.label")}</span>
            </div>
            <h2 className="font-display text-3xl tracking-tight text-ink md:text-4xl">
              {t("home.featured.title")}
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="hidden shrink-0 font-mono text-xs uppercase tracking-wide text-ink/60 transition-colors hover:text-lacquer sm:block"
          >
            {t("common.viewAll")} →
          </Link>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden border border-ink/15 hairline-grid sm:grid-cols-3">
          {featured.map((p) => (
            <Link
              key={p.id}
              href="/portfolio"
              className="group bg-paper"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.title[loc]}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="blueprint-grid-fine flex h-full w-full items-center justify-center p-6">
                    <FrontElevation
                      product={p.category}
                      w={p.dimensions.w}
                      h={p.dimensions.h}
                      sections={p.category === "kitchen" ? 4 : 3}
                      swatch={oak}
                      handles={["wardrobe", "kitchen", "tvunit"].includes(p.category)}
                    />
                  </div>
                )}
              </div>
              <div className="border-t border-ink/10 p-5">
                <h3 className="font-display text-lg leading-snug text-ink">
                  {p.title[loc]}
                </h3>
                <p className="mt-1 text-sm text-ink/60">{p.material[loc]}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Why Tartoon ---------- */}
      <section className="border-y border-ink/10 bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="dim-line dim-line-left mb-3 text-brass">
            <span>{t("home.why.label")}</span>
          </div>
          <h2 className="font-display text-3xl tracking-tight text-paper md:text-4xl">
            {t("home.why.title")}
          </h2>

          <div className="mt-10 grid gap-px overflow-hidden border border-paper/15 sm:grid-cols-2 lg:grid-cols-4">
            {whyPoints.map((p, i) => (
              <div key={p} className="bg-ink p-6">
                <span className="font-mono text-sm text-brass">0{i + 1}</span>
                <h3 className="mt-4 font-display text-lg text-paper">
                  {t(`home.why.${p}.title`)}
                </h3>
                <p className="mt-2 text-sm text-paper/60">
                  {t(`home.why.${p}.text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="blueprint-grid">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-20 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl tracking-tight text-ink md:text-4xl">
              {t("home.cta.title")}
            </h2>
            <p className="mt-3 max-w-lg text-ink/70">{t("home.cta.text")}</p>
          </div>
          <Link href="/order" className="btn btn-primary shrink-0">
            {t("home.cta.button")}
          </Link>
        </div>
      </section>
    </>
  );
}
