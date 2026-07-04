export type NavKey =
  | "calculator"
  | "configurator"
  | "order"
  | "portfolio"
  | "reviews";

export type NavItem = {
  index: string; // номер как у детали в спецификации сборки
  href: string;
  key: NavKey;
};

export const navItems: NavItem[] = [
  { index: "01", href: "/calculator", key: "calculator" },
  { index: "02", href: "/configurator", key: "configurator" },
  { index: "03", href: "/order", key: "order" },
  { index: "04", href: "/portfolio", key: "portfolio" },
  { index: "05", href: "/reviews", key: "reviews" },
];
