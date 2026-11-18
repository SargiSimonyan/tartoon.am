"use client";

import dynamic from "next/dynamic";

/** Loads three.js only on the configurator page, never on the server. */
export const Furniture3D = dynamic(
  () => import("./furniture-3d").then((m) => m.Furniture3D),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 animate-pulse bg-ink/5" />,
  },
);