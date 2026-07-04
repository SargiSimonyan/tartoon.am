import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["hy", "ru", "en"],
  defaultLocale: "hy",
});

export type AppLocale = (typeof routing.locales)[number];
