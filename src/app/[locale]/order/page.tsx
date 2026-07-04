import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OrderContent />;
}

function OrderContent() {
  const t = useTranslations("orderPage");

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <div className="dim-line mb-6 text-oak">
        <span>{t("sectionLabel")}</span>
      </div>
      <h1 className="font-display text-4xl text-ink">{t("title")}</h1>
      <p className="mt-4 text-ink/70">{t("description")}</p>

      <form className="mt-10 space-y-5">
        <Field label={t("nameLabel")} name="name" placeholder={t("namePlaceholder")} />
        <Field label={t("phoneLabel")} name="phone" placeholder={t("phonePlaceholder")} />
        <div>
          <label className="font-mono text-xs uppercase text-ink/50">
            {t("detailsLabel")}
          </label>
          <textarea
            name="details"
            rows={4}
            placeholder={t("detailsPlaceholder")}
            className="mt-2 w-full border border-ink/20 bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-lacquer"
          />
        </div>

        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed border border-ink/30 bg-ink/10 px-5 py-3 font-mono text-xs uppercase tracking-wide text-ink/40"
        >
          {t("submit")}
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="font-mono text-xs uppercase text-ink/50">{label}</label>
      <input
        name={name}
        placeholder={placeholder}
        className="mt-2 w-full border border-ink/20 bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-lacquer"
      />
    </div>
  );
}
