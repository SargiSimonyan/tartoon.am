import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ru", "en", "hy"],
  defaultLocale: "ru",
});

export type AppLocale = (typeof routing.locales)[number];
