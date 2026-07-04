import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CalculatorContent />;
}

function CalculatorContent() {
  const t = useTranslations("calculatorPage");

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="dim-line mb-6 text-oak">
        <span>{t("sectionLabel")}</span>
      </div>
      <h1 className="font-display text-4xl text-ink">{t("title")}</h1>
      <p className="mt-4 max-w-xl text-ink/70">{t("description")}</p>

      <div className="mt-10 grid gap-6 border border-dashed border-ink/30 p-8 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase text-ink/50">{t("step1")}</p>
          <p className="mt-2 text-sm text-ink/40">{t("step1Todo")}</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase text-ink/50">{t("step2")}</p>
          <p className="mt-2 text-sm text-ink/40">{t("step2Todo")}</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase text-ink/50">{t("step3")}</p>
          <p className="mt-2 text-sm text-ink/40">{t("step3Todo")}</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase text-ink/50">{t("total")}</p>
          <p className="mt-2 font-mono text-2xl text-lacquer">— ₽</p>
        </div>
      </div>
    </section>
  );
}
