import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ReviewsContent />;
}

function ReviewsContent() {
  const t = useTranslations("reviewsPage");
  const placeholders = [1, 2, 3];

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="dim-line mb-6 text-oak">
        <span>{t("sectionLabel")}</span>
      </div>
      <h1 className="font-display text-4xl text-ink">{t("title")}</h1>
      <p className="mt-4 max-w-xl text-ink/70">{t("description")}</p>

      <div className="mt-10 space-y-px overflow-hidden border border-ink/15 bg-ink/15">
        {placeholders.map((n) => (
          <div key={n} className="bg-paper p-6">
            <p className="font-mono text-xs uppercase text-brass">
              {t("placeholderName", { n })}
            </p>
            <p className="mt-2 text-sm text-ink/60">{t("placeholderText")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
