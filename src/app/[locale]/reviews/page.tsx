import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/page-header";
import { REVIEWS, averageRating } from "@/lib/reviews";
import type { Locale } from "@/lib/portfolio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reviewsPage" });
  return { title: t("title"), description: t("description") };
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reviewsPage");
  const loc = (await getLocale()) as Locale;
  const avg = averageRating();

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <PageHeader
        label={t("sectionLabel")}
        title={t("title")}
        description={t("description")}
      />

      <p className="mt-6 flex items-center gap-3 font-mono text-xs uppercase tracking-wide text-brass">
        <Stars value={avg} />
        {t("basedOn", { rating: avg, count: REVIEWS.length })}
      </p>

      <div className="mt-10 grid gap-px overflow-hidden border border-ink/15 hairline-grid sm:grid-cols-2">
        {REVIEWS.map((r) => (
          <figure key={r.id} className="flex flex-col gap-4 bg-paper p-6">
            <Stars value={r.rating} />
            <blockquote className="flex-1 text-ink/80">“{r.text[loc]}”</blockquote>
            <figcaption className="border-t border-ink/10 pt-4">
              <p className="font-display text-lg text-ink">{r.name}</p>
              <p className="font-mono text-[0.7rem] uppercase tracking-wide text-ink/50">
                {r.city[loc]} · {t("project")}: {r.project[loc]}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/order" className="btn btn-primary">
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex gap-0.5 text-oak" aria-label={`${value} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill={i < full ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3z" />
        </svg>
      ))}
    </span>
  );
}
