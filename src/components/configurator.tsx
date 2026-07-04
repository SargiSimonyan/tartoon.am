"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FrontElevation } from "@/components/front-elevation";
import {
  MATERIALS,
  HARDWARE,
  PRODUCTS,
  getMaterial,
  getProduct,
  quote,
  type ProductId,
  type Spec,
} from "@/lib/pricing";
import { formatAMD } from "@/lib/site";

// Products that show the "fronts / sections" control, with [min, max, default]
const SECTIONS: Partial<Record<ProductId, [number, number, number]>> = {
  wardrobe: [1, 6, 3],
  kitchen: [1, 8, 4],
  tvunit: [1, 4, 2],
  bookshelf: [2, 8, 4],
};
const HAS_HANDLES: ProductId[] = ["wardrobe", "kitchen", "tvunit"];

export function Configurator() {
  const t = useTranslations();
  const [spec, setSpec] = useState<Spec>({
    product: "wardrobe",
    w: 2000,
    h: 2400,
    d: 600,
    material: "veneer",
    hardware: "softclose",
  });
  const [sections, setSections] = useState(3);

  const product = getProduct(spec.product);
  const material = getMaterial(spec.material);
  const q = useMemo(() => quote(spec), [spec]);
  const sectionCfg = SECTIONS[spec.product];

  function pickProduct(id: ProductId) {
    const p = getProduct(id);
    setSpec((s) => ({ ...s, product: id, ...p.default }));
    setSections(SECTIONS[id]?.[2] ?? 1);
  }

  const summaryLine = [
    t(`catalog.product.${spec.product}`),
    `${spec.w}×${spec.h}×${spec.d} ${t("catalog.dim.mm")}`,
    t(`catalog.material.${spec.material}`),
    t(`catalog.hardware.${spec.hardware}`),
    `≈ ${formatAMD(q.total)}`,
  ].join(" · ");

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
      {/* ---------- Live preview ---------- */}
      <div className="flex flex-col">
        <div className="dim-line dim-line-left mb-4 text-oak">
          <span>{t("configuratorPage.frontView")}</span>
        </div>
        <div className="blueprint-grid-fine relative aspect-[4/3] w-full border border-ink/20 bg-paper">
          <FrontElevation
            product={spec.product}
            w={spec.w}
            h={spec.h}
            sections={sections}
            swatch={material.swatch}
            handles={HAS_HANDLES.includes(spec.product) && spec.hardware !== "standard"}
          />
          <span className="absolute left-3 top-3 font-mono text-[0.65rem] uppercase tracking-wide text-ink/40">
            {t(`catalog.product.${spec.product}`)} · 1:{Math.round(spec.h / 100)}
          </span>
        </div>
      </div>

      {/* ---------- Controls ---------- */}
      <aside className="space-y-8 border border-ink/15 p-6">
        {/* product */}
        <Control label={t("configuratorPage.product")}>
          <select
            value={spec.product}
            onChange={(e) => pickProduct(e.target.value as ProductId)}
            className="field-input mt-0"
          >
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {t(`catalog.product.${p.id}`)}
              </option>
            ))}
          </select>
        </Control>

        {/* dimensions */}
        <Control label={t("configuratorPage.size")}>
          <div className="space-y-4">
            <Slider
              name={t("catalog.dim.width")}
              value={spec.w}
              range={product.range.w}
              onChange={(v) => setSpec((s) => ({ ...s, w: v }))}
            />
            <Slider
              name={t("catalog.dim.height")}
              value={spec.h}
              range={product.range.h}
              onChange={(v) => setSpec((s) => ({ ...s, h: v }))}
            />
            <Slider
              name={t("catalog.dim.depth")}
              value={spec.d}
              range={product.range.d}
              onChange={(v) => setSpec((s) => ({ ...s, d: v }))}
            />
          </div>
        </Control>

        {/* sections */}
        {sectionCfg && (
          <Control label={t("configuratorPage.doors")}>
            <Slider
              name={t("configuratorPage.doors")}
              value={sections}
              range={[sectionCfg[0], sectionCfg[1]]}
              step={1}
              unit=""
              onChange={setSections}
            />
          </Control>
        )}

        {/* material */}
        <Control label={t("configuratorPage.material")}>
          <div className="flex gap-2">
            {MATERIALS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSpec((s) => ({ ...s, material: m.id }))}
                aria-pressed={spec.material === m.id}
                aria-label={t(`catalog.material.${m.id}`)}
                title={t(`catalog.material.${m.id}`)}
                className={`h-9 flex-1 border transition-all ${
                  spec.material === m.id
                    ? "border-lacquer ring-2 ring-lacquer/30"
                    : "border-ink/20 hover:border-ink/50"
                }`}
                style={{ backgroundColor: m.swatch }}
              />
            ))}
          </div>
          <p className="mt-2 font-mono text-[0.7rem] text-ink/60">
            {t(`catalog.material.${spec.material}`)}
          </p>
        </Control>

        {/* hardware */}
        <Control label={t("configuratorPage.hardware")}>
          <select
            value={spec.hardware}
            onChange={(e) =>
              setSpec((s) => ({ ...s, hardware: e.target.value as Spec["hardware"] }))
            }
            className="field-input mt-0"
          >
            {HARDWARE.map((h) => (
              <option key={h.id} value={h.id}>
                {t(`catalog.hardware.${h.id}`)}
              </option>
            ))}
          </select>
        </Control>

        {/* price */}
        <div className="border-t border-ink/15 pt-6">
          <p className="eyebrow text-ink/50">{t("configuratorPage.priceLabel")}</p>
          <p className="mt-1 font-display text-3xl text-lacquer">
            {formatAMD(q.total)}
          </p>
          <Link
            href={{
              pathname: "/order",
              query: { product: spec.product, details: summaryLine },
            }}
            className="btn btn-primary mt-5 w-full"
          >
            {t("configuratorPage.cta")}
          </Link>
          <p className="mt-4 text-[0.7rem] leading-relaxed text-ink/50">
            {t("configuratorPage.disclaimer")}
          </p>
        </div>
      </aside>
    </div>
  );
}

function Control({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow mb-3 text-oak">{label}</p>
      {children}
    </div>
  );
}

function Slider({
  name,
  value,
  range,
  step = 10,
  unit = "mm",
  onChange,
}: {
  name: string;
  value: number;
  range: [number, number];
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-xs">
        <span className="text-ink/60">{name}</span>
        <span className="text-ink">
          {value}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
      <input
        type="range"
        className="blueprint-range mt-2"
        value={value}
        min={range[0]}
        max={range[1]}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={name}
      />
    </div>
  );
}
