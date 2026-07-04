import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

const placeholders = Array.from({ length: 6 }, (_, i) => i + 1);

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PortfolioContent />;
}

function PortfolioContent() {
  const t = useTranslations("portfolioPage");

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="dim-line mb-6 text-oak">
        <span>{t("sectionLabel")}</span>
      </div>
      <h1 className="font-display text-4xl text-ink">{t("title")}</h1>
      <p className="mt-4 max-w-xl text-ink/70">{t("description")}</p>

      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-ink/15 bg-ink/15 md:grid-cols-3">
        {placeholders.map((n) => (
          <div
            key={n}
            className="flex aspect-square items-center justify-center bg-paper font-mono text-xs text-ink/30"
          >
            IMG {String(n).padStart(2, "0")}
          </div>
        ))}
      </div>
    </section>
  );
}
