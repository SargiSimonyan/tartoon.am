"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  DEFAULT_SPEC,
  HARDWARE,
  MATERIALS,
  PRODUCTS,
  getProduct,
  quote,
  type HardwareId,
  type MaterialId,
  type ProductId,
  type Spec,
} from "@/lib/pricing";
import { formatAMD } from "@/lib/site";

export function Calculator() {
  const t = useTranslations();
  const [spec, setSpec] = useState<Spec>(DEFAULT_SPEC);

  const product = getProduct(spec.product);
  const q = useMemo(() => quote(spec), [spec]);

  function pickProduct(id: ProductId) {
    const p = getProduct(id);
    // reset dimensions to the new product's sensible defaults
    setSpec((s) => ({ ...s, product: id, ...p.default }));
  }

  function setDim(key: "w" | "h" | "d", value: number) {
    const [min, max] = product.range[key];
    const clamped = Math.min(max, Math.max(min, value || min));
    setSpec((s) => ({ ...s, [key]: clamped }));
  }

  // Human-readable spec used to prefill the request form
  const summaryLine = [
    t(`catalog.product.${spec.product}`),
    `${spec.w}×${spec.h}×${spec.d} ${t("catalog.dim.mm")}`,
    t(`catalog.material.${spec.material}`),
    t(`catalog.hardware.${spec.hardware}`),
    `≈ ${formatAMD(q.total)}`,
  ].join(" · ");

  return (
    <div className="mt-10 grid gap-px overflow-hidden border border-ink/15 hairline-grid lg:grid-cols-[1fr_360px]">
      {/* ---------- Controls ---------- */}
      <div className="space-y-10 bg-paper p-6 md:p-8">
        {/* Step 1 — product */}
        <Fieldset step={t("calculatorPage.step1")}>
          <div className="grid grid-cols-2 gap-px overflow-hidden border border-ink/15 hairline-grid sm:grid-cols-3">
            {PRODUCTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => pickProduct(p.id)}
                aria-pressed={spec.product === p.id}
                className={`px-3 py-4 text-left font-mono text-xs uppercase tracking-wide transition-colors ${
                  spec.product === p.id
                    ? "bg-ink text-paper"
                    : "bg-paper text-ink/70 hover:bg-oak/10"
                }`}
              >
                {t(`catalog.product.${p.id}`)}
              </button>
            ))}
          </div>
        </Fieldset>

        {/* Step 2 — dimensions */}
        <Fieldset step={t("calculatorPage.step2")}>
          <div className="grid gap-6 sm:grid-cols-3">
            <DimControl
              label={t("catalog.dim.width")}
              unit={t("catalog.dim.mm")}
              value={spec.w}
              range={product.range.w}
              onChange={(v) => setDim("w", v)}
            />
            <DimControl
              label={t("catalog.dim.height")}
              unit={t("catalog.dim.mm")}
              value={spec.h}
              range={product.range.h}
              onChange={(v) => setDim("h", v)}
            />
            <DimControl
              label={t("catalog.dim.depth")}
              unit={t("catalog.dim.mm")}
              value={spec.d}
              range={product.range.d}
              onChange={(v) => setDim("d", v)}
            />
          </div>
        </Fieldset>

        {/* Step 3 — material */}
        <Fieldset step={t("calculatorPage.step3")}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MATERIALS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSpec((s) => ({ ...s, material: m.id }))}
                aria-pressed={spec.material === m.id}
                className={`flex flex-col gap-3 border p-3 text-left transition-colors ${
                  spec.material === m.id
                    ? "border-lacquer"
                    : "border-ink/15 hover:border-ink/40"
                }`}
              >
                <span
                  className="h-10 w-full border border-ink/20"
                  style={{ backgroundColor: m.swatch }}
                />
                <span className="font-mono text-[0.7rem] uppercase leading-tight text-ink/70">
                  {t(`catalog.material.${m.id as MaterialId}`)}
                </span>
                <span className="font-mono text-[0.65rem] text-brass">
                  {t("calculatorPage.ratePerM2", { rate: formatAMD(m.rate) })}
                </span>
              </button>
            ))}
          </div>
        </Fieldset>

        {/* Step 4 — hardware */}
        <Fieldset step={t("calculatorPage.step4")}>
          <div className="grid gap-px overflow-hidden border border-ink/15 hairline-grid sm:grid-cols-3">
            {HARDWARE.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setSpec((s) => ({ ...s, hardware: h.id }))}
                aria-pressed={spec.hardware === h.id}
                className={`px-4 py-4 text-left font-mono text-xs uppercase tracking-wide transition-colors ${
                  spec.hardware === h.id
                    ? "bg-ink text-paper"
                    : "bg-paper text-ink/70 hover:bg-oak/10"
                }`}
              >
                {t(`catalog.hardware.${h.id as HardwareId}`)}
              </button>
            ))}
          </div>
        </Fieldset>
      </div>

      {/* ---------- Summary ---------- */}
      <aside className="bg-ink p-6 text-paper md:p-8">
        <div className="sticky top-24">
          <div className="dim-line dim-line-left mb-6 text-brass">
            <span>{t("calculatorPage.summary")}</span>
          </div>

          <dl className="space-y-3 font-mono text-xs">
            <Row
              label={t("calculatorPage.breakdown.base", {
                product: t(`catalog.product.${spec.product}`),
              })}
              value={formatAMD(q.base)}
            />
            <Row
              label={t("calculatorPage.breakdown.material", {
                area: q.panelArea,
              })}
              value={formatAMD(q.materialCost)}
            />
            <Row
              label={t("calculatorPage.breakdown.hardware")}
              value={formatAMD(q.hardwareCost)}
            />
          </dl>

          <div className="mt-6 border-t border-paper/20 pt-6">
            <p className="eyebrow text-paper/50">{t("calculatorPage.total")}</p>
            <p className="mt-1 font-display text-4xl text-paper">
              {formatAMD(q.total)}
            </p>
          </div>

          <Link
            href={{
              pathname: "/order",
              query: { product: spec.product, details: summaryLine },
            }}
            className="btn btn-ghost mt-6 w-full border-paper/40 text-paper hover:border-lacquer hover:text-lacquer"
          >
            {t("calculatorPage.cta")}
          </Link>

          <p className="mt-4 text-[0.7rem] leading-relaxed text-paper/50">
            {t("calculatorPage.disclaimer")}
          </p>
        </div>
      </aside>
    </div>
  );
}

function Fieldset({
  step,
  children,
}: {
  step: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="eyebrow mb-4 text-oak">{step}</legend>
      {children}
    </fieldset>
  );
}

function DimControl({
  label,
  unit,
  value,
  range,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  range: [number, number];
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="field-label">{label}</label>
        <span className="font-mono text-xs text-ink/40">{unit}</span>
      </div>
      <input
        type="number"
        value={value}
        min={range[0]}
        max={range[1]}
        step={10}
        onChange={(e) => onChange(Number(e.target.value))}
        className="field-input"
      />
      <input
        type="range"
        className="blueprint-range mt-3"
        value={value}
        min={range[0]}
        max={range[1]}
        step={10}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-paper/60">{label}</dt>
      <dd className="whitespace-nowrap text-paper">{value}</dd>
    </div>
  );
}
