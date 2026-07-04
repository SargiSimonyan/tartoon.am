import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { OrderForm } from "@/components/order-form";
import { PageHeader } from "@/components/page-header";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "orderPage" });
  return { title: t("title"), description: t("description") };
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("orderPage");

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <PageHeader
        label={t("sectionLabel")}
        title={t("title")}
        description={t("description")}
      />
      <Suspense fallback={null}>
        <OrderForm />
      </Suspense>
    </section>
  );
}
