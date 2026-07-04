/**
 * Pricing catalog + cost logic — shared by the calculator and the configurator.
 *
 * Prices are in Armenian Dram (AMD). The model is intentionally transparent:
 *
 *   total = base
 *         + panelArea × materialRate
 *         + hardwareBase + panelArea × hardwareRate
 *
 * where panelArea = frontArea (m²) × panelFactor. The panelFactor approximates
 * how much developed board area a product needs relative to its front face
 * (a wardrobe has many internal shelves → high factor; a table → low).
 *
 * Labels are resolved via next-intl using the id (e.g. t(`catalog.product.wardrobe`)).
 * Tune the numbers below to match real workshop rates.
 */

export type ProductId =
  | "wardrobe"
  | "kitchen"
  | "bookshelf"
  | "tvunit"
  | "bed"
  | "table";

export type MaterialId = "ldsp" | "mdf" | "veneer" | "oak";
export type HardwareId = "standard" | "softclose" | "premium";

export type Product = {
  id: ProductId;
  /** flat base price in AMD */
  base: number;
  /** developed-area multiplier relative to front face */
  panelFactor: number;
  /** default dimensions (mm) for sliders / initial state */
  default: { w: number; h: number; d: number };
  /** slider ranges (mm) */
  range: { w: [number, number]; h: [number, number]; d: [number, number] };
  /** how many doors/fronts by default (used by configurator preview) */
  defaultDoors: number;
};

export type Material = {
  id: MaterialId;
  /** AMD per m² of developed panel area */
  rate: number;
  /** hex used in the configurator preview */
  swatch: string;
};

export type Hardware = {
  id: HardwareId;
  base: number; // AMD flat
  rate: number; // AMD per m² of developed panel area
};

export const PRODUCTS: Product[] = [
  {
    id: "wardrobe",
    base: 60000,
    panelFactor: 3.2,
    default: { w: 2000, h: 2400, d: 600 },
    range: { w: [600, 4000], h: [1800, 2700], d: [350, 800] },
    defaultDoors: 3,
  },
  {
    id: "kitchen",
    base: 90000,
    panelFactor: 3.8,
    default: { w: 3000, h: 2200, d: 600 },
    range: { w: [1200, 6000], h: [1400, 2400], d: [300, 700] },
    defaultDoors: 4,
  },
  {
    id: "bookshelf",
    base: 50000,
    panelFactor: 2.8,
    default: { w: 1200, h: 2000, d: 350 },
    range: { w: [600, 3000], h: [900, 2600], d: [250, 500] },
    defaultDoors: 0,
  },
  {
    id: "tvunit",
    base: 45000,
    panelFactor: 2.4,
    default: { w: 1800, h: 500, d: 400 },
    range: { w: [900, 3600], h: [300, 900], d: [300, 600] },
    defaultDoors: 2,
  },
  {
    id: "bed",
    base: 55000,
    panelFactor: 1.8,
    default: { w: 1800, h: 900, d: 2100 },
    range: { w: [900, 2200], h: [300, 1400], d: [1900, 2200] },
    defaultDoors: 0,
  },
  {
    id: "table",
    base: 40000,
    panelFactor: 1.4,
    default: { w: 1400, h: 750, d: 800 },
    range: { w: [600, 3000], h: [720, 1100], d: [600, 1200] },
    defaultDoors: 0,
  },
];

export const MATERIALS: Material[] = [
  { id: "ldsp", rate: 18000, swatch: "#c9b48f" },
  { id: "mdf", rate: 26000, swatch: "#b98a52" },
  { id: "veneer", rate: 42000, swatch: "#a8763e" },
  { id: "oak", rate: 68000, swatch: "#7d5327" },
];

export const HARDWARE: Hardware[] = [
  { id: "standard", base: 0, rate: 0 },
  { id: "softclose", base: 25000, rate: 3000 },
  { id: "premium", base: 60000, rate: 7000 },
];

export type Spec = {
  product: ProductId;
  w: number; // mm
  h: number; // mm
  d: number; // mm
  material: MaterialId;
  hardware: HardwareId;
};

export type Quote = {
  frontArea: number; // m²
  panelArea: number; // m²
  base: number;
  materialCost: number;
  hardwareCost: number;
  total: number;
};

export function getProduct(id: ProductId): Product {
  return PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
}
export function getMaterial(id: MaterialId): Material {
  return MATERIALS.find((m) => m.id === id) ?? MATERIALS[0];
}
export function getHardware(id: HardwareId): Hardware {
  return HARDWARE.find((h) => h.id === id) ?? HARDWARE[0];
}

export function quote(spec: Spec): Quote {
  const product = getProduct(spec.product);
  const material = getMaterial(spec.material);
  const hardware = getHardware(spec.hardware);

  const frontArea = (spec.w / 1000) * (spec.h / 1000);
  const panelArea = frontArea * product.panelFactor;

  const materialCost = panelArea * material.rate;
  const hardwareCost = hardware.base + panelArea * hardware.rate;
  const total = product.base + materialCost + hardwareCost;

  return {
    frontArea: round2(frontArea),
    panelArea: round2(panelArea),
    base: product.base,
    materialCost: roundTo(materialCost, 1000),
    hardwareCost: roundTo(hardwareCost, 1000),
    total: roundTo(total, 1000),
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
function roundTo(n: number, step: number) {
  return Math.round(n / step) * step;
}

export const DEFAULT_SPEC: Spec = {
  product: "wardrobe",
  w: 2000,
  h: 2400,
  d: 600,
  material: "mdf",
  hardware: "softclose",
};
