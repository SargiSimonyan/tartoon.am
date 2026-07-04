"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/lib/pricing";
import { whatsappHref, telegramHref, site } from "@/lib/site";
import { WhatsappIcon, TelegramIcon } from "@/components/icons";

type Status = "idle" | "sending" | "success" | "error";

export function OrderForm() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useSearchParams();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState(params.get("product") ?? "");
  const [details, setDetails] = useState(params.get("details") ?? "");

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const productLabel = product ? t(`catalog.product.${product}`) : "";

  function composeMessage(): string {
    return [
      `${t("orderPage.title")} — tartoon.am`,
      name && `${t("orderPage.nameLabel")}: ${name}`,
      phone && `${t("orderPage.phoneLabel")}: ${phone}`,
      productLabel && `${t("orderPage.productLabel")} ${productLabel}`,
      details && `${t("orderPage.detailsLabel")}: ${details}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  function validate(): boolean {
    const next: { name?: string; phone?: string } = {};
    if (name.trim().length < 2) next.name = t("orderPage.errName");
    if (phone.replace(/\D/g, "").length < 7) next.phone = t("orderPage.errPhone");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, product: productLabel, details, locale }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  const wa = whatsappHref(composeMessage());
  const tg = telegramHref(composeMessage());

  if (status === "success") {
    return (
      <div className="mt-10 border border-sage/40 bg-sage/10 p-8">
        <div className="dim-line dim-line-left mb-4 text-sage">
          <span>✓ {t("orderPage.sectionLabel")}</span>
        </div>
        <h2 className="font-display text-2xl text-ink">
          {t("orderPage.successTitle")}
        </h2>
        <p className="mt-3 max-w-md text-ink/70">{t("orderPage.successText")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <WhatsappIcon className="h-4 w-4" /> {t("contact.whatsapp")}
            </a>
          )}
          {tg && (
            <a href={tg} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <TelegramIcon className="h-4 w-4" /> {t("contact.telegram")}
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-10 max-w-2xl space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="name">
            {t("orderPage.nameLabel")} *
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("orderPage.namePlaceholder")}
            className="field-input"
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="mt-1 font-mono text-xs text-lacquer">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="field-label" htmlFor="phone">
            {t("orderPage.phoneLabel")} *
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("orderPage.phonePlaceholder")}
            className="field-input"
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="mt-1 font-mono text-xs text-lacquer">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="email">
            {t("orderPage.emailLabel")}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("orderPage.emailPlaceholder")}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="product">
            {t("orderPage.productLabel")}
          </label>
          <select
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="field-input"
          >
            <option value="">—</option>
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {t(`catalog.product.${p.id}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="details">
          {t("orderPage.detailsLabel")}
        </label>
        <textarea
          id="details"
          rows={4}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={t("orderPage.detailsPlaceholder")}
          className="field-input"
        />
      </div>

      {status === "error" && (
        <p className="font-mono text-xs text-lacquer">{t("orderPage.errorText")}</p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? t("orderPage.submit") + "…" : t("orderPage.submit")}
        </button>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink/60 transition-colors hover:text-lacquer"
          >
            <WhatsappIcon className="h-4 w-4" /> {t("orderPage.orWhatsapp")}
          </a>
        )}
      </div>

      <p className="font-mono text-[0.7rem] text-ink/40">
        {site.phone} · {site.email}
      </p>
    </form>
  );
}
