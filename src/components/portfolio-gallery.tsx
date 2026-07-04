"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { FrontElevation } from "@/components/front-elevation";
import { CATEGORIES, PROJECTS, type Locale } from "@/lib/portfolio";
import { MATERIALS, type ProductId } from "@/lib/pricing";

const DEFAULT_SECTIONS: Record<string, number> = {
  wardrobe: 3,
  kitchen: 4,
  bookshelf: 4,
  tvunit: 2,
  bed: 1,
  table: 1,
};

export function PortfolioGallery() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [filter, setFilter] = useState<ProductId | "all">("all");

  const visible = PROJECTS.filter(
    (p) => filter === "all" || p.category === filter,
  );

  return (
    <div className="mt-10">
      {/* filter chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const label = c === "all" ? t("portfolioPage.all") : t(`catalog.product.${c}`);
          const active = filter === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={active}
              className={`border px-3 py-2 font-mono text-[0.7rem] uppercase tracking-wide transition-colors ${
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/20 text-ink/60 hover:border-ink/50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center font-mono text-sm text-ink/40">
          {t("portfolioPage.empty")}
        </p>
      ) : (
        <div className="grid gap-px overflow-hidden border border-ink/15 hairline-grid sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => {
            const swatch =
              MATERIALS.find((m) => m.id === "veneer")?.swatch ?? "#a8763e";
            return (
              <article key={p.id} className="group bg-paper">
                <div className="relative aspect-[4/5] overflow-hidden">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.title[locale]}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="blueprint-grid-fine flex h-full w-full items-center justify-center p-6">
                      <FrontElevation
                        product={p.category}
                        w={p.dimensions.w}
                        h={p.dimensions.h}
                        sections={DEFAULT_SECTIONS[p.category] ?? 1}
                        swatch={swatch}
                        handles={["wardrobe", "kitchen", "tvunit"].includes(p.category)}
                      />
                    </div>
                  )}
                  <span className="absolute right-3 top-3 border border-ink/20 bg-paper/90 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-wide text-ink/60">
                    {t(`catalog.product.${p.category}`)}
                  </span>
                </div>
                <div className="border-t border-ink/10 p-5">
                  <h3 className="font-display text-lg leading-snug text-ink">
                    {p.title[locale]}
                  </h3>
                  <p className="mt-1 text-sm text-ink/60">{p.material[locale]}</p>
                  <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-wide text-brass">
                    {p.dimensions.w}×{p.dimensions.h}×{p.dimensions.d}{" "}
                    {t("catalog.dim.mm")} · {p.year}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
