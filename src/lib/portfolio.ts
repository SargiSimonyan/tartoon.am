import type { ProductId } from "./pricing";

export type Locale = "hy" | "ru" | "en";
export type Localized = Record<Locale, string>;

export type Project = {
  id: string;
  category: ProductId;
  /** photo in /public, or null to render a generated blueprint illustration */
  image: string | null;
  title: Localized;
  /** short material / spec line */
  material: Localized;
  /** finished dimensions W×H×D in mm */
  dimensions: { w: number; h: number; d: number };
  year: number;
};

export const PROJECTS: Project[] = [
  {
    id: "octagon-shelving",
    category: "bookshelf",
    image: "/polkeq.jpg",
    title: {
      hy: "Ութանկյուն մոդուլային դարակաշար",
      ru: "Восьмигранный модульный стеллаж",
      en: "Octagonal modular shelving",
    },
    material: {
      hy: "Կաղնու շպոն, մատ սև ներկ",
      ru: "Дубовый шпон, матовая чёрная эмаль",
      en: "Oak veneer, matte black lacquer",
    },
    dimensions: { w: 1600, h: 2400, d: 320 },
    year: 2025,
  },
  {
    id: "walk-in-wardrobe",
    category: "wardrobe",
    image: null,
    title: {
      hy: "Հանդերձարան՝ ապակե ճակատներով",
      ru: "Гардеробная со стеклянными фасадами",
      en: "Walk-in wardrobe with glass fronts",
    },
    material: {
      hy: "ՄԴՖ, ալյումինե պրոֆիլ, փափուկ փակում",
      ru: "МДФ, алюминиевый профиль, soft-close",
      en: "MDF, aluminium profile, soft-close",
    },
    dimensions: { w: 3200, h: 2600, d: 620 },
    year: 2025,
  },
  {
    id: "island-kitchen",
    category: "kitchen",
    image: null,
    title: {
      hy: "Խոհանոց կղզյակով",
      ru: "Кухня с островом",
      en: "Kitchen with island",
    },
    material: {
      hy: "Ներկված ՄԴՖ, քարե աշխատանքային մակերես",
      ru: "Крашеный МДФ, каменная столешница",
      en: "Painted MDF, stone worktop",
    },
    dimensions: { w: 4200, h: 2200, d: 600 },
    year: 2024,
  },
  {
    id: "oak-dining-table",
    category: "table",
    image: null,
    title: {
      hy: "Ճաշասեղան կաղնու զանգվածից",
      ru: "Обеденный стол из массива дуба",
      en: "Solid oak dining table",
    },
    material: {
      hy: "Կաղնու զանգված, յուղաներկ",
      ru: "Массив дуба, масло-воск",
      en: "Solid oak, oil-wax finish",
    },
    dimensions: { w: 2000, h: 750, d: 950 },
    year: 2024,
  },
  {
    id: "floating-tv-unit",
    category: "tvunit",
    image: null,
    title: {
      hy: "Կախովի TV վահանակ",
      ru: "Подвесная ТВ-тумба",
      en: "Floating TV unit",
    },
    material: {
      hy: "ՄԴՖ, ինտեգրված LED լուսավորում",
      ru: "МДФ, встроенная LED-подсветка",
      en: "MDF, integrated LED lighting",
    },
    dimensions: { w: 2400, h: 480, d: 400 },
    year: 2024,
  },
  {
    id: "platform-bed",
    category: "bed",
    image: null,
    title: {
      hy: "Հարթակ-մահճակալ փափուկ գլխամասով",
      ru: "Кровать-платформа с мягким изголовьем",
      en: "Platform bed with upholstered headboard",
    },
    material: {
      hy: "Կաղնու շպոն, կտորե երեսպատում",
      ru: "Дубовый шпон, тканевая обивка",
      en: "Oak veneer, fabric upholstery",
    },
    dimensions: { w: 1900, h: 1050, d: 2150 },
    year: 2023,
  },
];

export const CATEGORIES: (ProductId | "all")[] = [
  "all",
  "wardrobe",
  "kitchen",
  "bookshelf",
  "table",
  "tvunit",
  "bed",
];
