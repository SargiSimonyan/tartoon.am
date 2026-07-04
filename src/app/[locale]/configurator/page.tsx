import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Configurator } from "@/components/configurator";
import { PageHeader } from "@/components/page-header";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "configuratorPage" });
  return { title: t("title"), description: t("description") };
}

export default async function ConfiguratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("configuratorPage");

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <PageHeader
        label={t("sectionLabel")}
        title={t("title")}
        description={t("description")}
      />
      <Configurator />
    </section>
  );
}
