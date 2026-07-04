import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Calculator } from "@/components/calculator";
import { PageHeader } from "@/components/page-header";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calculatorPage" });
  return { title: t("title"), description: t("description") };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("calculatorPage");

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <PageHeader
        label={t("sectionLabel")}
        title={t("title")}
        description={t("description")}
      />
      <Calculator />
    </section>
  );
}
