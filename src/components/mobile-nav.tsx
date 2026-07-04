"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/nav";

export function MobileNav() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 border border-ink/20"
      >
        <span
          className={`block h-px w-4 bg-ink transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`}
        />
        <span
          className={`block h-px w-4 bg-ink transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div className="fixed inset-x-0 top-[57px] z-40 border-b border-ink/10 bg-paper">
          <nav className="mx-auto max-w-6xl px-6 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-2 border-b border-ink/10 py-3 font-mono text-sm uppercase tracking-wide text-ink/80 last:border-b-0"
              >
                <span className="text-brass">{item.index}</span>
                {t(`nav.${item.key}.label`)}
              </Link>
            ))}
            <Link
              href="/order"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-4 w-full"
            >
              {t("header.cta")}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
