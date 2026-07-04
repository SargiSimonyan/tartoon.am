import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default async function ConfiguratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ConfiguratorContent />;
}

function ConfiguratorContent() {
  const t = useTranslations("configuratorPage");

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="dim-line mb-6 text-oak">
        <span>{t("sectionLabel")}</span>
      </div>
      <h1 className="font-display text-4xl text-ink">{t("title")}</h1>
      <p className="mt-4 max-w-xl text-ink/70">{t("description")}</p>

      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="flex aspect-video items-center justify-center border border-dashed border-ink/30 bg-ink/5 font-mono text-xs uppercase text-ink/40">
          {t("canvasTodo")}
        </div>
        <div className="space-y-6 border border-ink/15 p-6">
          <div>
            <p className="font-mono text-xs uppercase text-ink/50">{t("material")}</p>
            <p className="mt-2 text-sm text-ink/40">{t("materialTodo")}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase text-ink/50">{t("size")}</p>
            <p className="mt-2 text-sm text-ink/40">{t("sizeTodo")}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase text-ink/50">{t("hardware")}</p>
            <p className="mt-2 text-sm text-ink/40">{t("hardwareTodo")}</p>
          </div>
        </div>
      </div>

      <p className="mt-8 font-mono text-xs text-ink/40">{t("stackNote")}</p>
    </section>
  );
}
