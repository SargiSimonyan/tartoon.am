import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { PageHeader } from "@/components/page-header";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolioPage" });
  return { title: t("title"), description: t("description") };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("portfolioPage");

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <PageHeader
        label={t("sectionLabel")}
        title={t("title")}
        description={t("description")}
      />
      <PortfolioGallery />
    </section>
  );
}
